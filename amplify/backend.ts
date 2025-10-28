import { RemovalPolicy, Tags } from "aws-cdk-lib";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { defineBackend } from "@aws-amplify/backend";
import ci from "ci-info";
import { Duration } from "aws-cdk-lib";
import { AnalyticsTemplate } from "./analytics";

// throw new Error("Category analytics is unsupported, please follow https://docs.amplify.aws/react/build-a-backend/add-aws-services/analytics/")
// throw new Error("Category geo is unsupported, please follow https://docs.amplify.aws/react/build-a-backend/add-aws-services/geo/")
let AMPLIFY_GEN_1_ENV_NAME = process.env.AMPLIFY_GEN_1_ENV_NAME ?? 'dev';
if (ci.isCI && !AMPLIFY_GEN_1_ENV_NAME) {
    throw new Error("AMPLIFY_GEN_1_ENV_NAME is required in CI environment");
}
else if (!ci.isCI && !AMPLIFY_GEN_1_ENV_NAME) {
    AMPLIFY_GEN_1_ENV_NAME = "sandbox";
}

const backend = defineBackend({
    auth,
    data
});
const cfnUserPool = backend.auth.resources.cfnResources.cfnUserPool;
cfnUserPool.userPoolName = `reactamplified93066f02_userpool_93066f02-${AMPLIFY_GEN_1_ENV_NAME}`;
cfnUserPool.usernameAttributes = undefined;
cfnUserPool.policies = {
    passwordPolicy: {
        minimumLength: 8,
        requireLowercase: false,
        requireNumbers: false,
        requireSymbols: false,
        requireUppercase: false,
        temporaryPasswordValidityDays: 7
    }
};
const cfnIdentityPool = backend.auth.resources.cfnResources.cfnIdentityPool;
cfnIdentityPool.identityPoolName = `reactamplified93066f02_identitypool_93066f02__${AMPLIFY_GEN_1_ENV_NAME}`;
const userPool = backend.auth.resources.userPool;
const userPoolClient = userPool.addClient("NativeAppClient", {
    disableOAuth: true,
    authSessionValidity: Duration.minutes(3),
    userPoolClientName: "reacta93066f02_app_client",
    enablePropagateAdditionalUserContextData: false,
    enableTokenRevocation: true,
    refreshTokenValidity: Duration.days(30),
    generateSecret: false
});
// Tags.of(backend.stack).add("gen1-migrated-app", "true");
const stack = backend.createStack('AnalyticsStack');
new AnalyticsTemplate(stack, 'AnalyticsTemplateStack', {
  amplifyEnv: AMPLIFY_GEN_1_ENV_NAME!,
  authPolicyName: 'kinesis_amplify_7f827584',
  authRoleName: backend.auth.resources.authenticatedUserIamRole.roleName,
  kinesisStreamName: 'reactamplifiedKinesis',
  unauthPolicyName: 'kinesis_amplify_7f827584',
  unauthRoleName: backend.auth.resources.unauthenticatedUserIamRole.roleName,
});
