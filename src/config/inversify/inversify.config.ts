
import { Container } from "inversify";

import { inversifyTypes } from "./inversify.types";
import { UserService } from "../../use-cases/user/user.service";

import "../../use-cases/home/home.controller";

const container = new Container();

container.bind<UserService>(inversifyTypes.UserService).to(UserService);

export { container };