#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {CertificateStack} from "../lib/certificate-stack";
import {StaticSiteStack} from "../lib/static-site-stack";
import {HicCdnStack} from "../lib/cdn-stack";
import {HicApiStack} from "../lib/api-stack";

const app = new cdk.App();
const domainName = 'example.com'
new CertificateStack(app, domainName);
new StaticSiteStack(app, 'HicGalleryStack', {}, {
    name: 'prod',
    domainName,
    certificateArn: 'BUILD_CERTIFICATE_STACK_PUT_THE_ARN_HERE'
});
new HicCdnStack(app, 'HicCdnStack', {});
new HicApiStack(app, 'HicApiStack', {});
