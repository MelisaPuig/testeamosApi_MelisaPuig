const dotenv = require("dotenv").config();
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const path = require("path");

const DATABASES = require("../constants/databases");

const argv = yargs(hideBin(process.argv)).argv;

const getEnvironmentVariableOrError = (environmentVarName) => {
  const environmentVariable = process.env[environmentVarName];
  if (
    typeof environmentVariable === "undefined" ||
    environmentVariable === ""
  ) {
    throw new Error(
      `No se ha establecido la variable de entorno "${environmentVarName}".`
    );
  }
  return environmentVariable;
};

const getCliArgOrDefault = (argName, defaultValue) => {
  const argumentValue = argv[argName];
  if (typeof argumentValue === "undefined") {
    console.log(
      `No se estableció el valor del argumento "${argName}". Usando por defecto "${defaultValue}".`
    );
    return defaultValue;
  }
  return argumentValue;
};

const getDatabaseTypeFromCli = () => {
  const { ARCHIVO, MEMORIA, MONGO, FIREBASE } = DATABASES;
  const databases = [ARCHIVO, MEMORIA, MONGO, FIREBASE];
  const databaseTypeArg = argv["database-type"];
  if (typeof databaseTypeArg === "undefined") {
    throw new Error(
      `No se estableció el tipo de base de datos en la línea de comando. Usar --database-type= ${databases.join(
        ", "
      )}`
    );
  }
  if (!databases.includes(databaseTypeArg)) {
    throw new Error(
      `No se reconoce el tipo de base de datos ${databaseTypeArg}`
    );
  }
  return databaseTypeArg;
};

module.exports = {
  IS_CLUSTER: typeof argv["cluster"] !== "undefined",
  DATABASE_TYPE: getDatabaseTypeFromCli(),
  FIREBASE_CONFIG_PATH: path.join(__dirname, "firebase-config.json"),
  MONGO_URL: process.env.MONGO_URL,
  SESSION_SECRET: getEnvironmentVariableOrError("SESSION_SECRET"),
  PORT: getCliArgOrDefault("port", 8080),
};
