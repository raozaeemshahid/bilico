export const GenderError = "Please Select a Gender";

const ErrorsComponent: React.FC<{ errors: string[] }> = ({ errors }) => {
  return (
    <>
      <div>
        {errors.map((err) => (
          <p className="text-sm text-red-600" key={err}>
            {err}
          </p>
        ))}
      </div>
    </>
  );
};

export default ErrorsComponent;
