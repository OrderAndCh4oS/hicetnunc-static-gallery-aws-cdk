import {CfnOutput, Construct, Duration, RemovalPolicy, Stack, StackProps} from "@aws-cdk/core";
import {Bucket} from "@aws-cdk/aws-s3";
import {BucketDeployment, CacheControl, ServerSideEncryption, Source, StorageClass} from "@aws-cdk/aws-s3-deployment";
import {CloudFrontWebDistribution} from "@aws-cdk/aws-cloudfront";

interface IEnvironment {
    name: string,
    domainName: string,
    certificateArn: string
}

export class StaticSiteStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps, environment: IEnvironment) {
        super(scope, id, props);

        const websiteBucket = new Bucket(this, 'HicGalleryWebsiteBucket', {
            bucketName: 'hic-gallery',
            websiteIndexDocument: 'index.html',
            publicReadAccess: true,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        const distribution = new CloudFrontWebDistribution(
            this,
            "HicGalleryWebDistribution",
            {
                viewerCertificate: {
                    aliases: [environment.domainName],
                    props: {
                        acmCertificateArn: environment.certificateArn,
                        sslSupportMethod: "sni-only",
                    },
                },
                originConfigs: [
                    {
                        s3OriginSource: {
                            s3BucketSource: websiteBucket,
                        },
                        behaviors: [{isDefaultBehavior: true}],
                    },
                ],
            }
        );

        new CfnOutput(this, "DistributionDomainName", {
            value: distribution.distributionDomainName,
        });

        new BucketDeployment(this, 'HicGalleryDeployWebsite', {
            sources: [Source.asset('./static-site')],
            destinationBucket: websiteBucket,
            distribution,
            distributionPaths: ['/'],
            contentLanguage: "en",
            storageClass: StorageClass.INTELLIGENT_TIERING,
            serverSideEncryption: ServerSideEncryption.AES_256,
            cacheControl: [CacheControl.setPublic(), CacheControl.maxAge(Duration.hours(1))],
        });
    }
}
