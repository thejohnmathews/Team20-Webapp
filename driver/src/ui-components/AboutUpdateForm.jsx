/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getAbout } from "../graphql/queries";
import { updateAbout } from "../graphql/mutations";
const client = generateClient();
export default function AboutUpdateForm(props) {
  const {
    id: idProp,
    about: aboutModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    teamName: "",
    teamNumber: "",
    versionNumber: "",
    productName: "",
  };
  const [teamName, setTeamName] = React.useState(initialValues.teamName);
  const [teamNumber, setTeamNumber] = React.useState(initialValues.teamNumber);
  const [versionNumber, setVersionNumber] = React.useState(
    initialValues.versionNumber
  );
  const [productName, setProductName] = React.useState(
    initialValues.productName
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = aboutRecord
      ? { ...initialValues, ...aboutRecord }
      : initialValues;
    setTeamName(cleanValues.teamName);
    setTeamNumber(cleanValues.teamNumber);
    setVersionNumber(cleanValues.versionNumber);
    setProductName(cleanValues.productName);
    setErrors({});
  };
  const [aboutRecord, setAboutRecord] = React.useState(aboutModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getAbout.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getAbout
        : aboutModelProp;
      setAboutRecord(record);
    };
    queryData();
  }, [idProp, aboutModelProp]);
  React.useEffect(resetStateValues, [aboutRecord]);
  const validations = {
    teamName: [],
    teamNumber: [],
    versionNumber: [],
    productName: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          teamName: teamName ?? null,
          teamNumber: teamNumber ?? null,
          versionNumber: versionNumber ?? null,
          productName: productName ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateAbout.replaceAll("__typename", ""),
            variables: {
              input: {
                id: aboutRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "AboutUpdateForm")}
      {...rest}
    >
      <TextField
        label="Team name"
        isRequired={false}
        isReadOnly={false}
        value={teamName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              teamName: value,
              teamNumber,
              versionNumber,
              productName,
            };
            const result = onChange(modelFields);
            value = result?.teamName ?? value;
          }
          if (errors.teamName?.hasError) {
            runValidationTasks("teamName", value);
          }
          setTeamName(value);
        }}
        onBlur={() => runValidationTasks("teamName", teamName)}
        errorMessage={errors.teamName?.errorMessage}
        hasError={errors.teamName?.hasError}
        {...getOverrideProps(overrides, "teamName")}
      ></TextField>
      <TextField
        label="Team number"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={teamNumber}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              teamName,
              teamNumber: value,
              versionNumber,
              productName,
            };
            const result = onChange(modelFields);
            value = result?.teamNumber ?? value;
          }
          if (errors.teamNumber?.hasError) {
            runValidationTasks("teamNumber", value);
          }
          setTeamNumber(value);
        }}
        onBlur={() => runValidationTasks("teamNumber", teamNumber)}
        errorMessage={errors.teamNumber?.errorMessage}
        hasError={errors.teamNumber?.hasError}
        {...getOverrideProps(overrides, "teamNumber")}
      ></TextField>
      <TextField
        label="Version number"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={versionNumber}
        onChange={(e) => {
          let value = isNaN(parseFloat(e.target.value))
            ? e.target.value
            : parseFloat(e.target.value);
          if (onChange) {
            const modelFields = {
              teamName,
              teamNumber,
              versionNumber: value,
              productName,
            };
            const result = onChange(modelFields);
            value = result?.versionNumber ?? value;
          }
          if (errors.versionNumber?.hasError) {
            runValidationTasks("versionNumber", value);
          }
          setVersionNumber(value);
        }}
        onBlur={() => runValidationTasks("versionNumber", versionNumber)}
        errorMessage={errors.versionNumber?.errorMessage}
        hasError={errors.versionNumber?.hasError}
        {...getOverrideProps(overrides, "versionNumber")}
      ></TextField>
      <TextField
        label="Product name"
        isRequired={false}
        isReadOnly={false}
        value={productName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              teamName,
              teamNumber,
              versionNumber,
              productName: value,
            };
            const result = onChange(modelFields);
            value = result?.productName ?? value;
          }
          if (errors.productName?.hasError) {
            runValidationTasks("productName", value);
          }
          setProductName(value);
        }}
        onBlur={() => runValidationTasks("productName", productName)}
        errorMessage={errors.productName?.errorMessage}
        hasError={errors.productName?.hasError}
        {...getOverrideProps(overrides, "productName")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || aboutModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || aboutModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
