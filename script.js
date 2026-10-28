

if (window.AOS) {
    AOS.init({ duration: 700, once: true });
    document.documentElement.classList.add("aos-ok");
}
 

const botonesFiltro = document.querySelectorAll("[data-filtro]");
botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
        botonesFiltro.forEach((b) => b.classList.remove("active"));
        boton.classList.add("active");
        document.querySelectorAll("[data-juego]").forEach((tarjeta) => {
            const oculta = boton.dataset.filtro !== "todos" && tarjeta.dataset.juego !== boton.dataset.filtro;
            tarjeta.classList.toggle("d-none", oculta);
        });
        if (window.AOS) AOS.refreshHard();
    });
});
 

const estiloAlerta = { background: "#0A0A0A", color: "#FFF3B0", confirmButtonColor: "#CC0000" };
 
document.querySelectorAll(".btn-info-extra").forEach((boton) => {
    boton.addEventListener("click", () => {
        Swal.fire({ title: boton.dataset.titulo, text: boton.dataset.texto, icon: "info", ...estiloAlerta });
    });
});
 

const formulario = document.querySelector("#formRanking");
 
if (formulario) {
    const CLAVE = "votosFNAF";
 
    const BASE = [
        { juego: "Five Nights at Freddy's", puntos: 8.1, votos: 10, img: "img/five-nights-at-freddys-juego-portada.jpg" },
        { juego: "Five Nights at Freddy's 2", puntos: 8.9, votos: 10, img: "img/five-nights-at-freddys-2-juego-portada.jpg" },
        { juego: "Five Nights at Freddy's 3", puntos: 7.5, votos: 10, img: "img/five-nights-at-freddys-3-juego-portada.jpg" },
        { juego: "Five Nights at Freddy's 4", puntos: 9.2, votos: 10, img: "img/five-nights-at-freddys-4-juego-portada.jpg" },
        { juego: "Sister Location", puntos: 8.5, votos: 10, img: "img/five-nights-at-freddys-sister-location-juego-portada.jpg" },
        { juego: "Security Breach", puntos: 7.8, votos: 10, img: "img/five-nights-at-freddys-security-breach-juego-portada.jpg" },
    ];
 
    const leerVotos = () => {
        try { return JSON.parse(localStorage.getItem(CLAVE)) || []; } catch { return []; }
    };
 
    const guardarVoto = (voto) => {
        try { localStorage.setItem(CLAVE, JSON.stringify([...leerVotos(), voto])); } catch {                        }
    };
 

    const pintar = () => {
        const votos = leerVotos();
        const top = BASE.map((j) => {
            const mios = votos.filter((v) => v.juego === j.juego);
            const suma = mios.reduce((total, v) => total + v.puntos * 2, 0);
            return { nombre: j.juego, img: j.img, nota: (j.puntos * j.votos + suma) / (j.votos + mios.length) };
        }).sort((a, b) => b.nota - a.nota).slice(0, 5);
 
        const lista = document.querySelector("#top");
        lista.replaceChildren();
        top.forEach((j, i) => {
            const li = document.createElement("li");
            const foto = document.createElement("img");
            foto.src = j.img;
            foto.alt = `Portada de ${j.nombre}`;
            foto.className = "portada-mini";
            const texto = document.createElement("span");
            texto.textContent = `${i + 1}. ${j.nombre}`;
            const nota = document.createElement("strong");
            nota.textContent = j.nota.toFixed(1);
            li.append(foto, texto, nota);
            lista.append(li);
        });
 
        const contenedor = document.querySelector("#opiniones");
        contenedor.replaceChildren();
        const ejemplo = [
            { nombre: "FazbearFan", juego: BASE[1].juego, puntos: 5, opinion: "El mejor de todos: la atmósfera es increíble y los sustos funcionan." },
            { nombre: "NightGuard23", juego: BASE[4].juego, puntos: 4, opinion: "Muy innovador. La historia y los personajes son geniales." },
            { nombre: "PizzaLover", juego: BASE[3].juego, puntos: 5, opinion: "Me dio el verdadero miedo. ¡Qué pesadilla tan buena!" },
            { nombre: "Springfan", juego: BASE[2].juego, puntos: 4, opinion: "Un gran cierre de la primera etapa de la saga." },
        ];
        [...votos].reverse().concat(ejemplo).forEach((v) => {
            const col = document.createElement("div");
            col.className = "col";
            const tarjeta = document.createElement("article");
            tarjeta.className = "card card-fnaf h-100 card-body";
            const titulo = document.createElement("h3");
            titulo.className = "h6";
            titulo.textContent = `${v.nombre} · ${v.juego} · ${"★".repeat(v.puntos)}`;
            const texto = document.createElement("p");
            texto.className = "mb-0";
            texto.textContent = v.opinion;
            tarjeta.append(titulo, texto);
            col.append(tarjeta);
            contenedor.append(col);
        });
    };
 
    const mensajes = {
        nombre: "Escribe al menos 3 letras.",
        correo: "Escribe un correo válido, por ejemplo nombre@correo.com.",
        juego: "Elige un juego.",
        puntos: "Elige una puntuación.",
        opinion: "Cuéntanos al menos 10 caracteres.",
        acepto: "Debes aceptar para continuar.",
    };
    const extra = {
        nombre: (v) => v.trim().length >= 3,
        opinion: (v) => v.trim().length >= 10,
    };
 
    const marcar = (campo, valido, mensaje) => {
        const clave = campo.type === "radio" ? campo.name : campo.id;
        const grupo = campo.type === "radio" ? formulario.querySelectorAll(`[name="${campo.name}"]`) : [campo];
        grupo.forEach((c) => {
            c.classList.toggle("is-invalid", !valido);
            c.classList.toggle("is-valid", valido);
        });
        document.querySelector(`#error-${clave}`).textContent = valido ? "" : mensaje;
        return valido;
    };
 
    const revisar = (campo) => {
        const clave = campo.type === "radio" ? campo.name : campo.id;
        const valido = campo.checkValidity() && (!extra[clave] || extra[clave](campo.value));
        return marcar(campo, valido, mensajes[clave]);
    };
 
    const controles = [...formulario.elements].filter((c) => c.name);
 
    formulario.addEventListener("invalid", (evento) => {
        evento.preventDefault();
        revisar(evento.target);
    }, true);
 
    controles.forEach((campo) => {
        campo.addEventListener("blur", () => revisar(campo));
        campo.addEventListener("change", () => revisar(campo));
    });
 
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault(); 
 
        if (resultados.every(Boolean)) {
            guardarVoto({
                nombre: formulario.elements.nombre.value.trim(),
                juego: formulario.elements.juego.value,
                puntos: Number(formulario.querySelector("input[name='puntos']:checked").value),
                opinion: formulario.elements.opinion.value.trim(),
            });
            formulario.reset();
            formulario.querySelectorAll(".is-valid, .is-invalid").forEach((c) => c.classList.remove("is-valid", "is-invalid"));
            pintar();
            Swal.fire({ title: "¡Gracias por votar!", text: "Tu opinión ya aparece en la comunidad.", icon: "success", ...estiloAlerta });
        } else {
            Swal.fire({ title: "Revisa el formulario", text: "Hay campos con errores.", icon: "error", ...estiloAlerta });
        }
    });
 
    pintar();
}