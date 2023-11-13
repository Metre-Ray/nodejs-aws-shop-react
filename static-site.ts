import { Stack } from 'aws-cdk-lib/core';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class StaticSite extends Stack  {
    constructor(parent, name: string) {
        super(parent, name);

        const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, 'aaa');

        const siteBucket = new s3.Bucket(this, 'FirstBucket', {
            bucketName: 'first-bucket-236858709800-u',
            websiteIndexDocument: 'index.html',
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        })

        siteBucket.addToResourcePolicy(new iam.PolicyStatement({
            actions: ['S3:GetObject'],
            resources: [siteBucket.arnForObjects('*')],
            principals: [ new iam.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
        }));

        const distribution = new cloudfront.CloudFrontWebDistribution(this, 'first-distribution', {
            originConfigs: [{
                s3OriginSource: {
                    s3BucketSource: siteBucket,
                    originAccessIdentity: cloudfrontOAI,
                },
                behaviors: [{
                    isDefaultBehavior: true,
                }],
            }],
        });

        new s3deploy.BucketDeployment(this, 'first-auto-deployment', {
            sources: [s3deploy.Source.asset('./dist')],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ['/*'],
        });
    }

}
