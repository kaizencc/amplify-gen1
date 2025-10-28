import { defineData } from "@aws-amplify/backend";

const schema = `# This "input" configures a global authorization rule to enable public access to
# all models in this schema. Learn more about authorization rules here: https://docs.amplify.aws/react/build-a-backend/graphqlapi/customize-authorization-rules/

input AMPLIFY {
  globalAuthRule: AuthRule = { allow: public }
} # FOR TESTING ONLY!
type Todo @model {
  id: ID!
  name: String!
  description: String
}`;

export const data = defineData({
    migratedAmplifyGen1DynamoDbTableMappings: [{
            // Replace the environment name (abcde) with the corresponding branch name. Use "sandbox" for your sandbox environment.
            branchName: "sandbox",
            modelNameToTableNameMapping: { Todo: "Todo-liix25ytbjafjec55mvxirek4q-abcde" }
        }, {
            // Replace the environment name (dev) with the corresponding branch name. Use "sandbox" for your sandbox environment.
            branchName: "dev",
            /**
            * Unable to find the table mapping for this environment.
            * This could be due the enableGen2Migration feature flag not being set to true for this environment.
            * Please enable the feature flag and push the backend resources.
            * If you are not planning to migrate this environment, you can remove this key.
            */
            modelNameToTableNameMapping: {}
        }, {
            // Replace the environment name (migrate) with the corresponding branch name. Use "sandbox" for your sandbox environment.
            branchName: "migrate",
            modelNameToTableNameMapping: { Todo: "Todo-4wzexewchvdkxihuf6msin6e7m-migrate" }
        }],
    schema
});
