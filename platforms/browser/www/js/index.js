$(document).ready(function () {
    console.log("Mostrando home");
    cargarHomeContent();
    $("#onclickjugar").click(function () {
        var level = getNumberLevel();
        sonidoNivel = document.getElementById(nivel[level].cancion);
        sonidoNivel.load();
        sonidoNivel.play();
        seleccion[level] = "si";
        $('#opciona').html(nivel[level].opcionA);
        $('#opcionb').html(nivel[level].opcionB);
        $('#opcionc').html(nivel[level].opcionC);
        $('#opciond').html(nivel[level].opcionD);
        $('#opciona').val(nivel[level].opcionA);
        $('#opcionb').val(nivel[level].opcionB);
        $('#opcionc').val(nivel[level].opcionC);
        $('#opciond').val(nivel[level].opcionD);
        for (i = 0; i < coleccionIdImagenes.length; i++) {
            $(coleccionIdImagenes[i]).css("display", "none");
        }
        idImagen = getImagen(level);
        console.log(idImagen);
        $(idImagen).show();
        $(idImagen).removeClass("blurImage");
        setTimeout(function () { $(idImagen).addClass("blurImage"); }, 6500);
        respuestaGlobal = nivel[level].respuesta;
        $("#accionJugar").fadeOut(500, function () {
            $("#homeSubTitle").fadeOut(500, function () {
                $("#homeTitle").fadeOut(500, function () {
                    cargarGameContent();
                    $('#ldiv').fadeIn(1000, function () {
                        $('#rdiv').fadeIn(1000);
                    });
                });
            });
        });
    });

    $(document).on('click', "li.opcionCiudades", function () {
        var opcion = $(this).text() + "";
        sonidoNivel.pause();
        if (respuestaGlobal.localeCompare(opcion) == 0) {
            if (juegosCompletos()) {
                $("#msgModal1").text("Juego Terminado!");
                $("#msgModal2").text("Lograste Todos los niveles!");
                for (i = 0; i < seleccion.length; i++) {
                    seleccion[i] = "no";
                }
                $('#modalGame').modal('show');
                setTimeout(function () { $('#modalGame').modal('hide'); }, 3000);
                setTimeout(function () { cargarHomeContent(); }, 3000);
            } else {
                $("#msgModal1").text("Has Acertado!");
                $("#msgModal2").text("Pasa al siguiente nivel!");
                $('#modalGame').modal('show');
                setTimeout(function () { $('#modalGame').modal('hide'); }, 3000);
                var level = getNumberLevel();
                sonidoNivel = document.getElementById(nivel[level].cancion);
                sonidoNivel.load();
                sonidoNivel.play();
                seleccion[level] = "si";
                $('#opciona').html(nivel[level].opcionA);
                $('#opcionb').html(nivel[level].opcionB);
                $('#opcionc').html(nivel[level].opcionC);
                $('#opciond').html(nivel[level].opcionD);
                $('#opciona').val(nivel[level].opcionA);
                $('#opcionb').val(nivel[level].opcionB);
                $('#opcionc').val(nivel[level].opcionC);
                $('#opciond').val(nivel[level].opcionD);
                for (i = 0; i < coleccionIdImagenes.length; i++) {
                    $(coleccionIdImagenes[i]).css("display", "none");
                }
                idImagen = getImagen(level);
                $(idImagen).show();
                $(idImagen).removeClass("blurImage");
                setTimeout(function () { $(idImagen).addClass("blurImage"); }, 6000);
                respuestaGlobal = nivel[level].respuesta;
            }
        } else {
            console.log("No he acertado");
            console.log(respuestaGlobal);
            console.log(opcion);
            finJuego();
        }

    });

    function getImagen(level) {
        var src = imagenUrlArr[level].imagenUrl;
        src += getRandomInt(1, 2);
        src += "Image";
        return src;
    }

    function finJuego() {
        for (i = 0; i < seleccion.length; i++) {
            seleccion[i] = "no";
        }
        $("#msgModal1").html("¡Has Perdido!");
        $("#msgModal2").html("Intenta en otra ocasión.");
        $('#modalGame').modal('show');
        for (i = 0; i < coleccionIdImagenes.length; i++) {
            $(coleccionIdImagenes[i]).removeClass("blurImage");
        }
        setTimeout(function () { $('#modalGame').modal('hide'); }, 3000);
        setTimeout(function () { cargarHomeContent(); }, 3000);
    }

    function juegosCompletos() {
        var contador = 0;
        for (i = 0; i < seleccion.length; i++) {
            if (seleccion[i].localeCompare("si") == 0) {
                contador++;
            }
        }
        console.log("Juegos completos = " + contador);
        if (contador == 4) return true;
        else return false;
    }

    function getNumberLevel() {
        var numero = getRandomInt(0, 3);
        if (seleccion[numero].localeCompare("si") == 0) {
            numero = getNumberLevel();
        }
        return numero;
    }

    function cargarHomeContent() {
        $('#contenedorGame').css("display", "none");
        $('#contenedorPrincipal').show();
        $("#accionJugar").show();
        $("#homeSubTitle").show();
        $("#homeTitle").show();
    }

    function cargarGameContent() {
        $('#contenedorPrincipal').css("display", "none");
        $('#contenedorGame').show();
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

});


