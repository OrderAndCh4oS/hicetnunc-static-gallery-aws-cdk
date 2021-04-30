import {CfnOutput, Construct, RemovalPolicy, Stack, StackProps} from "@aws-cdk/core";
import {Bucket} from "@aws-cdk/aws-s3";
import {CloudFrontWebDistribution} from "@aws-cdk/aws-cloudfront";

export class HicCdnStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const cdnBucket = new Bucket(this, 'HicCdnBucket', {
            bucketName: 'hic-cdn',
            publicReadAccess: true,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        const distribution = new CloudFrontWebDistribution(
            this,
            "HicCdnDistribution",
            {
                originConfigs: [
                    {
                        s3OriginSource: {
                            s3BucketSource: cdnBucket,
                        },
                        behaviors: [{isDefaultBehavior: true}],
                    },
                ],
            }
        );

        new CfnOutput(this, "DistributionDomainName", {
            value: distribution.distributionDomainName,
        });
    }
}
