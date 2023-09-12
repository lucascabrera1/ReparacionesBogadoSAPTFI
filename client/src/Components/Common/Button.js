export default function Button({type = "button", onClick, className ='px-2 py-1', children}) {
    return (
        <button type={type} onClick={onClick} className={className}>{children}</button>
    )
}