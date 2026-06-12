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

function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPW] = useState("");
  const navigate = useNavigate();

  //--------- API CALL --------------
  const loginUser = async () => {
    const response = await fetch("http://localhost:5117/login", {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        email: email,
        passHash: pw,
      }),
    });
    if (response.ok) {
      navigate("/home");
    } else {
      console.log("Error logging in ");
    }
  };
  //------------- APP BUILD ---------------
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-screen h-screen flex flex-1 items-center justify-center">
        <Card className="flex  w-1/2">
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <CardContent className="items-center flex flex-col">
            <FieldGroup className="mb-3">
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
                    setPW(e.target.value);
                  }}
                ></Input>
              </Field>
            </FieldGroup>
            <Button
              className="text-white! w-1/4"
              onClick={() => {
                loginUser();
              }}
            >
              Login
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <Link to="/register"> Don't have an account yet? Sign up</Link>
          </CardFooter>
        </Card>
      </div>
    </ThemeProvider>
  );
}
export default LoginPage;
