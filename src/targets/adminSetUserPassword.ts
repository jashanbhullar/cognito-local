import { Services } from "../services";
import { UserAttribute, User } from "../services/userPoolClient";

interface Input {
  UserPoolId: string;
  Username: string;
  Password: string;
  Permanent: boolean;
}

interface Output {
  ResultMetaData: any;
}

export type AdminSetUserPasswordType = (body: Input) => Promise<Output>;

export const AdminSetUserPassword = ({
  cognitoClient,
}: Services): AdminSetUserPasswordType => async (body) => {
  const userPool = await cognitoClient.getUserPool(body.UserPoolId);
  const user = await userPool.getUserByUsername(body.Username);
  const updatedUser = {
    UserStatus: body.Permanent ? "CONFIRMED" : "FORCE_CHANGE_PASSWORD",
    UserLastModifiedDate: new Date().getTime(),
    Password: body.Password,
  };

  const id = user?.Attributes.find((val) =>
    val.Name == "sub" ? val.Value : false
  )?.Value;
  console.log(id);

  await userPool.updateUser(id, updatedUser);

  return {
    ResultMetaData: {
      message: "Mocking cognito server",
    },
  };
};
