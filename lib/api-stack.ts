import {Construct, Duration, Stack, StackProps} from "@aws-cdk/core";
import {Runtime, Code, Function} from "@aws-cdk/aws-lambda";
import {Cors, LambdaIntegration, RestApi} from "@aws-cdk/aws-apigateway";
import {CONSEIL_API_KEY, CONSEIL_API_URL} from "./constants";

export class HicApiStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const api = new RestApi(this, `HicGalleryApi`, {
            restApiName: 'HicGalleryApi',
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS,
                allowHeaders: Cors.DEFAULT_HEADERS,
            },
        });

        const creations = new Function(this, 'Creations', {
            runtime: Runtime.NODEJS_14_X,
            handler: 'get-creations.handler',
            timeout: Duration.seconds(5),
            code: Code.fromAsset('./lambdas'),
            environment: {
                CONSEIL_API_URL,
                CONSEIL_API_KEY
            }
        });
        const collections = new Function(this, 'Collections', {
            runtime: Runtime.NODEJS_14_X,
            handler: 'get-collection.handler',
            timeout: Duration.seconds(5),
            code: Code.fromAsset('./lambdas'),
            environment: {
                CONSEIL_API_URL,
                CONSEIL_API_KEY
            }
        });
        const swaps = new Function(this, 'Swaps', {
            runtime: Runtime.NODEJS_14_X,
            handler: 'get-swaps.handler',
            timeout: Duration.seconds(5),
            code: Code.fromAsset('./lambdas'),
            environment: {
                CONSEIL_API_URL,
                CONSEIL_API_KEY
            }
        });

        api.root
            .addResource('creations')
            .addResource('{address}')
            .addMethod('GET', new LambdaIntegration(creations))
        api.root
            .addResource('collections')
            .addResource('{address}')
            .addMethod('GET', new LambdaIntegration(collections))
        api.root
            .addResource('swaps')
            .addResource('{address}')
            .addMethod('GET', new LambdaIntegration(swaps))
    }
}
