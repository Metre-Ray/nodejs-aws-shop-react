// import { Stack } from 'aws-cdk-lib/core';
import { StaticSite } from './static-site';
import * as cdk from 'aws-cdk-lib';

// class MyStaticSiteStack extends Stack {
//     constructor(parent, name) {
//         super(parent, name);

//         new StaticSite(this, 'FIrstWebsite');
//     }
// }

const app = new cdk.App();

new StaticSite(app, 'MyFIrstWebsite');

app.synth();
