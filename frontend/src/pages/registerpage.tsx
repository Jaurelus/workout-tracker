import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function RegisterPage() {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [passHash, setpassHash] = useState("");
  const [confirmPass, setconfirmPass] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [validFName, setvalidFName] = useState(true);
  const [validLName, setvalidLName] = useState(true);
  const [validPW, setValidPW] = useState("");
  const [validConfirm, setValidConfirm] = useState(true);

  const navigate = useNavigate();

  const validateEmail = (txt: string) => {
    const emailReg = /^\w+@\w+\.\w+$/;
    setValidEmail(emailReg.test(txt));
  };
  const validatePW = (txt: string) => {
    // 2 #
    const numberCheck = /\d.*\d/;
    const passNumberCheck = numberCheck.test(txt);
    //1 uppercase
    const upperCheck = /[A-Z]/;
    const passupperCheck = upperCheck.test(txt);
    //8+ chars
    if (txt.length <= 8) {
      setValidPW("Password must be at least 8 characters");
    } else if (!passNumberCheck) {
      setValidPW("Password must contain at least 2 numbers");
    } else if (!passupperCheck) {
      setValidPW("Password must contain at least 1 uppercase letter");
    } else setValidPW("");
  };
  const inputFilled = () => {
    if (
      fName == "" ||
      lName == "" ||
      email == "" ||
      passHash == "" ||
      confirmPass == ""
    ) {
      return false;
    } else return true;
  };

  //---------- API CALLS ---------------
  const registerUser = async () => {
    const response = await fetch("http://localhost:5117/register", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        firstName: fName,
        lastName: lName,
        email: email,
        passHash: passHash,
      }),
    });

    if (response.ok) {
      navigate("/login");
    } else toast.error("Error creating account");
  };
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-screen h-screen flex flex-1 items-center justify-center">
        <Card className="flex  w-1/2">
          <CardHeader>
            <CardTitle className="text-center">Register</CardTitle>
          </CardHeader>
          <CardContent className="items-center flex flex-col">
            <FieldGroup className="mb-3">
              <Field className="flex flex-row">
                <Field>
                  <FieldLabel>First Name</FieldLabel>
                  <Input
                    aria-invalid={!validFName}
                    className="border-input"
                    type="text"
                    onInput={(e) => {
                      setFName(e.target.value);
                    }}
                    onBlur={(e) => {
                      setvalidFName(!(e.target.value.trim() == ""));
                    }}
                  ></Input>
                  {!validFName && (
                    <FieldDescription>
                      <p className="flex text-red-400">
                        First name cannot be empty
                      </p>
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <FieldLabel>Last Name</FieldLabel>
                  <Input
                    aria-invalid={!validLName}
                    className="border-input"
                    type="text"
                    onInput={(e) => {
                      setLName(e.target.value);
                    }}
                    onBlur={(e) => {
                      setvalidLName(!(e.target.value.trim() == ""));
                    }}
                  ></Input>
                  {!validLName && (
                    <FieldDescription>
                      <p className="flex text-red-400">
                        Last name cannot be empty
                      </p>
                    </FieldDescription>
                  )}
                </Field>
              </Field>

              <Field>
                <FieldLabel>E-mail</FieldLabel>
                <Input
                  className="border-input"
                  aria-invalid={!validEmail}
                  type="email"
                  onInput={(e) => {
                    setEmail(e.target.value);
                  }}
                  onBlur={(e) => {
                    validateEmail(e.target.value);
                  }}
                ></Input>
                {!validEmail && (
                  <FieldDescription>
                    <p className="flex text-red-400">
                      Please enter a valid email
                    </p>
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  aria-invalid={validPW != ""}
                  className="border-input"
                  type="password"
                  onInput={(e) => {
                    setpassHash(e.target.value);
                  }}
                  onBlur={(e) => {
                    validatePW(e.target.value);
                  }}
                ></Input>
                {validPW && (
                  <FieldDescription>
                    <p className="flex text-red-400">{validPW}</p>
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel>Confirm Password</FieldLabel>
                <Input
                  type="password"
                  className="border-input"
                  aria-invalid={!validConfirm}
                  onInput={(e) => {
                    setValidConfirm(false);
                    setconfirmPass(e.target.value);
                  }}
                  onBlur={(e) => {
                    setValidConfirm(e.target.value.trim() == passHash);
                  }}
                ></Input>
                {!validConfirm && (
                  <FieldDescription>
                    <p className="flex text-red-400">Passwords must match</p>
                  </FieldDescription>
                )}
              </Field>
            </FieldGroup>
            <Button
              disabled={
                !validEmail || !validConfirm || validPW != "" || !inputFilled()
              }
              className="text-white! w-1/4"
              onClick={() => {
                registerUser();
              }}
            >
              Sign Up
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <Link to="/login"> Already have an account yet? Log in</Link>
          </CardFooter>
        </Card>
      </div>
    </ThemeProvider>
  );
}
export default RegisterPage;
