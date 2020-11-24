import vest, { group, test } from "vest";
import enforce from "vest/enforceExtended";

const v = vest.create("user_form", (data = {}, { currentField, mode }) => {
  vest.only(currentField);
  vest.only.group(mode); // SIGN_IN | SIGN_UP

  test("email", "Email Adress needs to be at least 3 characters", () => {
    enforce(data.email).isNotEmpty().longerThanOrEquals(3);
  });

  test("password", "Password is required", () => {
    enforce(data.password).isNotEmpty();
  });

  // Will only run when in sign up mode
  group("SIGN_UP", () => {
    test("email", "Not a valid email address", () => {
      enforce(data.email).isEmail();
    });

    test(
      "password",
      "Should contain numbers, upper and lower case letters",
      () => {
        vest.warn();
        enforce(data.password)
          .matches(/[0-9]/)
          .matches(/[a-z]/)
          .matches(/[A-Z]/);
      }
    );

    if (!v.get().hasErrors("password")) {
      test("confirm_password", "Passwords do not match", () => {
        enforce(data.password).equals(data.confirm_password);
      });
    }
  });
});

export default v;
