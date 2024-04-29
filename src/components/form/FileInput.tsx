import { CommonFieldProps } from 'redux-form';

/** FileInputPorps 型別 */
interface FileInputPorpsType {
  name: string;
  placeholder: string;
  classname: string;
  input: CommonFieldProps;
}

function FileInput({ name, placeholder, classname, input }: FileInputPorpsType) {
  return (
    <div className="relative">
      <span className="relative">
        <input
          name={name}
          type="file"
          placeholder={placeholder}
          className={`hidden ${classname} `}
          onChange={input.onChange}
        />
      </span>
    </div>
  );
}

export default FileInput;
