const productos = [

    { id: 1, nombre: 'Producto A', precio: 30 },
    
    { id: 2, nombre: 'Producto B', precio: 20 },
    
     { id: 3, nombre: 'Producto C', precio: 50 },
    
     { id: 4, nombre: 'Producto D', precio: 10 }
    
    ];
    
    
      const handler = async (req: Request): Promise<Response> => {
        const method = req.method;
        const url = new URL(req.url);
        const path = url.pathname;
        const searchParams = url.searchParams;

        const minPrecio = Number(url.searchParams.get("minPrecio"));
        const maxPrecio = Number(url.searchParams.get("maxPrecio"));
        
        if (method === "GET") {
            if (path === "/productos"){

                if (searchParams.get("minPrecio") && searchParams.get("maxPrecio") ){
                  const produnctosEntre = productos.filter(elem=> elem.precio > minPrecio && elem.precio < maxPrecio);
                  return new Response(JSON.stringify(produnctosEntre));          
                }
                else if (searchParams.get("minPrecio")) { 
                  const minimo = productos.filter(elem=> elem.precio > minPrecio);
                  return new Response (JSON.stringify(minimo));
                } else if (searchParams.get("maxPrecio")) { 
                  const maximo = productos.filter(elem=> elem.precio < minPrecio);
                  return new Response (JSON.stringify(maximo));
                } else {
                  return new Response (JSON.stringify(productos));
                }               
            }else if (path.startsWith("/producto/")) { 
            const strTmp = path.split("/") ;
            const id = Number( strTmp.at(2) );
            if (productos.find(u => u.id === id))  {
                const u = productos.find(elem => elem.id === id);
                return new Response(JSON.stringify(u));
            } else {
                return new Response("Producto no encontrado", { status: 404 });
            }   
    
          } else if (path === "/calcular-promedio") {
            //caso general
            const productoFiltrado = productos.filter(p => {
                const precio = p.precio;
                return (minPrecio ? precio >= Number(minPrecio) : true) && (maxPrecio ? precio <= Number(maxPrecio) : true);
            });
            const total = productoFiltrado.reduce((accumulador, p) => accumulador + p.precio, 0);
            const conteo = productoFiltrado.length;

            //caso específico
            const promedio = conteo > 0 ? total / conteo : 0;
            return new Response(JSON.stringify(promedio));
         }
    
        }
        return new Response("ERROR", { status: 404 });
      };
      
      Deno.serve({ port: 3000 }, handler);
      
