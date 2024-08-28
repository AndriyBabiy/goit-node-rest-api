import { DataTypes, STRING } from "sequelize";

import sequelize from "../sequelize.js";
import { emailRegexp } from "../../constants/authConstants.js";

const User = sequelize.define("users", {
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      is: emailRegexp,
    },
    allowNull: false,
    unique: true,
  },
  subscription: {
    type: DataTypes.ENUM,
    values: ["starter", "pro", "business"],
    defaultValue: "starter",
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
});

// User.sync({ force: true });
User.sync({ update: true });

export default User;
