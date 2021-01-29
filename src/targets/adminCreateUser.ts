import { Services } from "../services";
import { UserAttribute, User } from "../services/userPoolClient";

interface Input {
  UserPoolId: string;
  Username: string;
  TemporaryPassword: string;
  MessageAction?: string;
  UserAttributes: UserAttribute[];
}

export interface DynamoDBUserRecord {
  Username: string;
  UserCreateDate: number;
  UserLastModifiedDate: number;
  Enabled: boolean;
  UserStatus:
    | "CONFIRMED"
    | "UNCONFIRMED"
    | "RESET_REQUIRED"
    | "FORCE_CHANGE_PASSWORD";
  Attributes: readonly UserAttribute[];
}

interface Output {
  User: DynamoDBUserRecord;
  ResultMetaData: any;
}

export type AdminCreateUserType = (body: Input) => Promise<Output>;

export const AdminCreateUser = ({
  cognitoClient,
}: Services): AdminCreateUserType => async (body) => {
  const userPool = await cognitoClient.getUserPool(body.UserPoolId);
  console.log(body);
  const createUser: User = {
    Username: body.Username,
    UserCreateDate: new Date().getTime(),
    UserLastModifiedDate: new Date().getTime(),
    Enabled: true,
    UserStatus: "FORCE_CHANGE_PASSWORD",
    Attributes: body.UserAttributes,
    Password: body.TemporaryPassword,
  };
  const user = await userPool.saveUser(createUser);
  return {
    User: user,
    ResultMetaData: {
      message: "Mocking cognito server",
    },
  };
};
