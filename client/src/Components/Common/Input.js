import React from 'react'
import styles from '../../../src/App.css'

function Input({type, 
    classname = `form-control`,
    disabled = false,
    name, 
    label,
    register,
    placeholder,
    registerOptions, 
    errors, 
    optionMsgErrors,
    onBlur,
    onClick,
    value,
    checked
    }){
  return (
    <div>
        <label>{label}</label>
        <input
            style={{width: type==='number'?'100px':'300px'}}
            type={type} 
            placeholder={placeholder}
            className={classname}
            name={name}
            {...register(name, registerOptions)}
            disabled = {disabled}
            onBlur = {onBlur}
            onClick={onClick}
            value={value}
            checked={checked ? true : false}
        />
        {errors[name]?.type === "required" && <span style={{color: "red"}} >{optionMsgErrors.required}</span>}
        {errors[name]?.type === "minLength" && <span style={{color: "red"}} >{optionMsgErrors.minLength}</span>}
        {errors[name]?.type === "maxLength" && <span style={{color: "red"}} >{optionMsgErrors.maxLength}</span>}
        {errors[name]?.type === "pattern" && <span style={{color: "red"}} >{optionMsgErrors.pattern}</span>}
        {errors[name]?.type === "min" && <span style={{color: "red"}} >{optionMsgErrors.min}</span>}
        {errors[name]?.type === "max" && <span style={{color: "red"}} >{optionMsgErrors.max}</span>}
        {errors[name]?.type === "validate" && <span style={{color: "red"}} >{optionMsgErrors.validate}</span>}
    </div>
  )
}

export default Input