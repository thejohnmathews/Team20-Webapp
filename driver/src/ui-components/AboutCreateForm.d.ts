/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type AboutCreateFormInputValues = {
    teamName?: string;
    teamNumber?: number;
    versionNumber?: number;
    productName?: string;
};
export declare type AboutCreateFormValidationValues = {
    teamName?: ValidationFunction<string>;
    teamNumber?: ValidationFunction<number>;
    versionNumber?: ValidationFunction<number>;
    productName?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AboutCreateFormOverridesProps = {
    AboutCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    teamName?: PrimitiveOverrideProps<TextFieldProps>;
    teamNumber?: PrimitiveOverrideProps<TextFieldProps>;
    versionNumber?: PrimitiveOverrideProps<TextFieldProps>;
    productName?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type AboutCreateFormProps = React.PropsWithChildren<{
    overrides?: AboutCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: AboutCreateFormInputValues) => AboutCreateFormInputValues;
    onSuccess?: (fields: AboutCreateFormInputValues) => void;
    onError?: (fields: AboutCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AboutCreateFormInputValues) => AboutCreateFormInputValues;
    onValidate?: AboutCreateFormValidationValues;
} & React.CSSProperties>;
export default function AboutCreateForm(props: AboutCreateFormProps): React.ReactElement;
