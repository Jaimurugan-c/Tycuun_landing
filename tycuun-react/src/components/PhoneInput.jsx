import PhoneInputBase from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function PhoneInput({ value, onChange, className = '' }) {
  return (
    <div className={`phone-input-wrapper ${className}`}>
      <PhoneInputBase
        international
        defaultCountry="IN"
        value={value}
        onChange={onChange}
        placeholder="Enter phone number"
      />
    </div>
  );
}
