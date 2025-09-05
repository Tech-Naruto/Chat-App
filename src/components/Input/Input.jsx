import { Container } from "../index";
import { useEffect, useState } from "react";
function Input(
  {
    label,
    type = "text",
    placeholder = "",
    classNameLabel = "",
    classNameInput = "",
    error,
    setError,
    ...props
  },
  ref
) {
  const [hidePassword, setHidePassword] = useState(true);
  const [redBorder, setRedBorder] = useState(false);
  const [inputField, setInputField] = useState("");

  useEffect(() => {
    if (setError) {
      if (error.status === 400 && inputField.length === 0) {
        setRedBorder(true);
      } else if (
        (error.status === 409 ||
          error.status === 404 ||
          error.status === 401) &&
        error.message.toLowerCase().includes(label.toLowerCase())
      ) {
        setRedBorder(true);
      } else {
        setRedBorder(false);
      }
    }
  }, [error, inputField]);
  return (
    <>
      <Container>
        <div className="flex-col flex space-y-2">
          {label && (
            <div className="flex items-center justify-between">
              <label
                htmlFor="input"
                className={`px-2 ${classNameLabel} ${
                  redBorder ? "text-red-600" : ""
                }`}
              >
                {label}
                {error.status === 400 && inputField.length === 0 ? "*" : ""}
              </label>
              {type === "password" ? (
                <label
                  className={`text-sm cursor-pointer ${classNameLabel}`}
                  onClick={() => setHidePassword(!hidePassword)}
                >
                  {hidePassword ? (
                    <>
                      <i className="fa-solid fa-eye-slash"></i>
                      <span className="px-2">Hide</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-eye"></i>
                      <span className="px-2">Show</span>
                    </>
                  )}
                </label>
              ) : null}
            </div>
          )}
          <input
            id="input"
            type={type === "password" && !hidePassword ? "text" : type}
            placeholder={placeholder}
            ref={ref}
            className={`p-2 outline-1 rounded-xl focus:outline-[#04B2D9] ${classNameInput} ${
              redBorder ? "outline-red-600" : ""
            }`}
            {...props}
            onChange={(e) => {
              setInputField(e.target.value);
              if (e.target.value.length > 0) {
                setError({ status: 200, message: "" });
              }
            }}
          />
          {setError && (
            <p
              className={`text-xs px-2 text-red-600 ${
                redBorder &&
                (error.status === 409 ||
                  error.status === 404 ||
                  error.status === 401)
                  ? ""
                  : "invisible"
              }`}
            >
              {error.message || "&nbsp;"}
            </p>
          )}
        </div>
      </Container>
    </>
  );
}

export default Input;
