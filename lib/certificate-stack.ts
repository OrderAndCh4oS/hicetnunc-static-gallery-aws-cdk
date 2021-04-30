import { ValidationMethod } from "@aws-cdk/aws-certificatemanager";
import * as cm from "@aws-cdk/aws-certificatemanager";
import {CfnOutput, Construct, Stack} from "@aws-cdk/core";

export class CertificateStack extends Stack {
    constructor(scope: Construct, domainName: string) {
        super(scope, "CertificateStack", {
            env: { region: "us-east-1" },
        });

        const certificate = new cm.Certificate(this, "CustomDomainCertificate", {
            domainName,
            validationMethod: ValidationMethod.DNS,
        });

        const certificateArn = certificate.certificateArn;
        new CfnOutput(this, "CertificateArn", {
            value: certificateArn,
        });
    }
}
