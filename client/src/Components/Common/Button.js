import Button from 'react-bootstrap/Button';

export default function ButtonApp({type = "button", onClick, variant, children}) {

    return <Button type={type} onClick={onClick} variant={variant} size="md">{children}</Button>;
}