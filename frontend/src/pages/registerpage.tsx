import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [passHash, setpassHash] = useState("");
  const navigate = useNavigate();

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
    } else console.log("Error register user");
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
                    type="text"
                    onInput={(e) => {
                      setFName(e.target.value);
                    }}
                  ></Input>
                </Field>
                <Field>
                  <FieldLabel>Last Name</FieldLabel>
                  <Input
                    type="text"
                    onInput={(e) => {
                      setLName(e.target.value);
                    }}
                  ></Input>
                </Field>
              </Field>

              <Field>
                <FieldLabel>E-mail</FieldLabel>
                <Input
                  type="email"
                  onInput={(e) => {
                    setEmail(e.target.value);
                  }}
                ></Input>
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  type="password"
                  onInput={(e) => {
                    setpassHash(e.target.value);
                  }}
                ></Input>
              </Field>
              <Field>
                <FieldLabel>Confirm Password</FieldLabel>
                <Input type="password"></Input>
              </Field>
            </FieldGroup>
            <Button
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
