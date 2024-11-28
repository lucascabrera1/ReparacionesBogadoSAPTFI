import { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import Button from 'react-bootstrap/esm/Button'
import Input from './Common/Input'
import {AgregarProducto, ModificarProducto, RecuperarMarcas, RecuperarProveedores, RecuperarCategorias,
  SeleccionarTodasLasCategorias, SeleccionarTodosLosProveedores, SeleccionarTodasLasMarcas,
  EstadoCategorias, EstadoProveedores, EstadoMarcas} from '../Features/OrdenCompraSlice.js'
import Form from 'react-bootstrap/Form'

function FormProducto() {
    const params = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const marcas = useSelector(SeleccionarTodasLasMarcas)
    const categorias = useSelector(SeleccionarTodasLasCategorias)
    const proveedores = useSelector(SeleccionarTodosLosProveedores)
    const estadomarcas = useSelector(EstadoMarcas)
    const estadocategorias = useSelector(EstadoCategorias)
    const estadoproveedores = (useSelector(EstadoProveedores))
    const {register, handleSubmit, formState : {errors}} = useForm()

    console.log(marcas)
    console.log(categorias)
    console.log(proveedores)

    useEffect(()=>{
      if (estadomarcas==="idle"){
        dispatch(RecuperarMarcas())
      }
    },[estadomarcas])

    useEffect(()=>{
      if (estadocategorias==="idle"){
        dispatch(RecuperarCategorias())
      }
    },[estadocategorias])

    useEffect(()=>{
      if (estadoproveedores==="idle"){
        dispatch(RecuperarProveedores())
      }
    },[estadoproveedores])

    const optionProveedores = proveedores.map(p => (<option
      value={p._id} 
      key={p._id}
      >{p.razonsocial}
    </option>))

    optionProveedores.unshift(<option value="" key="">Seleccione</option>)

    const optionMarcas = marcas.map(marca => (<option
      value={marca._id} 
      key={marca._id}
      >{marca.nombre}
    </option>))

    optionMarcas.unshift(<option value="" key="">Seleccione</option>)

    const optionCategorias = categorias.map(cat => (<option
      value={cat._id} 
      key={cat._id}
      >{cat.descripcion}
    </option>))

    optionCategorias.unshift(<option value="" key="">Seleccione</option>)

    const handleSubmitProducto = async (data, e) => {
      console.log('params')
      console.log(params)
      console.log('fin params')
      console.log('data')
      console.log(data)
      console.log('fin data')
      if (params.id) {
        try {
          console.log(data)
          const result = await dispatch(ModificarProducto({...data, id: params.id})).unwrap()
          console.log(result.data)
          alert("Producto modificado correctamente")
          e.target.reset()
          navigate('/productos')
        } catch (error) {
          console.error(error)
        }
      } else {
        try {
          console.log('entra al agregar producto')
          console.log(data)
          const result = await dispatch(AgregarProducto(data)).unwrap()
          console.log(result)
          if (result.error) {
            alert('Hubo un error al guardar el producto: '+result.message)
          } else {
            alert('producto guardado correctamente')
            e.target.reset()
            navigate('/productos')
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
    return (
      <div className='App d-flex flex-column justify-content-md-center align-items-center'>
        Ingrese los datos del producto a agregar
        <Form 
          style={{width: '450px', border: '2px solid black'}}
          onSubmit={handleSubmit(handleSubmitProducto)}
          >
          <Form.Group className="mb-3 " controlId="dob">
            <br/>
            <Input
              type="number"
              name="codigo"
              placeholder="Código"
              register={register}
              registerOptions= {{
                  required: true, maxLength: 5, minLength: 2 
              }}
              errors= {errors}
              optionMsgErrors={{
                  required: "el código es obligatorio",
                  maxLength: "no puede incluir mas de 5 caracteres",
                  minLength: "al menos 2 caracteres "
              }}
            />
            <br/>
            <Form.Group>
              <label>Proveedor</label>
              <Form.Select
                aria-label='Proveedor'
                className='col-md-2'
                size='sm'
                name='proveedor'
                {...register('proveedor', {required: true})}
                onChange={e => {
                  e.preventDefault()
                  console.log(e.target.value)
                }}
              >
                {optionProveedores}
              </Form.Select>
              {
                errors["proveedor"]?.type === "required" && <> <span style={{color: "red"}} >
                    El Proveedor es requerido
                  </span>
                  <br/>
                </>
              }
              <label>Marca</label>
              <Form.Select
                aria-label='Marca'
                className='col-md-2'
                size='sm'
                name='marca'
                {...register('marca', {required: true})}
                onChange={e => {
                  e.preventDefault()
                  console.log(e.target.value)
                }}
              >
                {optionMarcas}
              </Form.Select>
              {
                errors["marca"]?.type === "required" && <> <span style={{color: "red"}} >
                    La marca es requerida
                  </span>
                  <br/>
                </>
              }
              <label>Categoria</label>
              <Form.Select
                aria-label='Categoria'
                className='col-md-2'
                size='sm'
                name='categoria'
                {...register('categoria', {required: true})}
                onChange={e => {
                  e.preventDefault()
                  console.log(e.target.value)
                }}
              >
                {optionCategorias}
              </Form.Select>
              {
                errors["categoria"]?.type === "required" && <> <span style={{color: "red"}} >
                    La Categoría es requerida
                  </span>
                  <br/>
                </>
              }
            </Form.Group>
            <br/> <br/>
            <Input
              type="text"
              name="descripcion"
              placeholder="Descripción del producto"
              register={register}
              registerOptions= {{
                  required: true, maxLength: 200, minLength: 3,
              }}
              errors= {errors}
              optionMsgErrors={{
                  required: "la descripción es obligatoria",
                  maxLength: "no puede incluir mas de 200 caracteres",
                  minLength: "al menos 3 caracteres"
              }}
            />
            <br/>
            <Input
              type="float"
              name="preciocompra"
              placeholder="Precio de Compra"
              register={register}
              registerOptions= {{required: true}}
              errors= {errors}
              optionMsgErrors={{required: "el precio de compra es obligatorio"}}
            />
            <br/>
            <Input
              type="float"
              name="precioventa"
              placeholder="Precio de Venta"
              register={register}
              registerOptions= {{required: true}}
              errors= {errors}
              optionMsgErrors={{required: "El precio de venta es obligatorio"}}
            />
            <br/>
            <Input
              type="number"
              classname='w-50'
              name="puntopedido"
              placeholder="Punto de Pedido"
              register={register}
              registerOptions= {{
                  required: true, max: 999, min: 10 
              }}
              errors= {errors}
              optionMsgErrors={{
                  required: "El punto de pedido es obligatorio",
                  max: "maximo 999",
                  min: "minimo 10"
              }}
            />
            <br/>
            <Input
              classname='w-50'
              type="number"
              name="stock"
              placeholder="Stock"
              register={register}
              registerOptions= {{required: true, min: 1}}
              optionMsgErrors={{
                required: "El stock es obligatorio",
                min: "minimo 1 en stock"
            }}
              errors= {errors}
            />
            <br/>
            <br/>
          </Form.Group>
          <Form.Group>
            <Button 
              className='col-lg-4' 
              style={{backgroundColor: 'green'}} //float: 'left'}} 
              type="submit" 
              size='lg'>
                Guardar
            </Button>
            <Button
                className='col-lg-4'
                //style={{float: 'right'}}
                variant="secondary" size = "lg"
                onClick={e => { e.preventDefault(); navigate('/productos')}}>
                  Cancelar
            </Button>
          </Form.Group>
        </Form>
      </div>
    )
}

export default FormProducto