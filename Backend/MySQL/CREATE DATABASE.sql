CREATE DATABASE IF NOT EXISTS recetas_db;
USE recetas_db;

CREATE TABLE usuarios (
	idUsuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	mail VARCHAR(150) UNIQUE,
	nickname VARCHAR(100) NOT NULL,
	habilitado ENUM('Si', 'No'),
	nombre VARCHAR(150),
	direccion VARCHAR(150),
	avatar VARCHAR(300)
);

CREATE TABLE alumnos (
	idAlumno INT NOT NULL PRIMARY KEY,
	numeroTarjeta VARCHAR(12),
	dniFrente VARCHAR(300),
	dniFondo VARCHAR(300),
	tramite VARCHAR(12),
	cuentaCorriente DECIMAL(12,2),
	FOREIGN KEY (idAlumno) REFERENCES usuarios(idUsuario)
);

CREATE TABLE tiposReceta (
	idTipo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	descripcion VARCHAR(250)
);

CREATE TABLE recetas (
	idReceta INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	idUsuario INT,
	nombreReceta VARCHAR(500),
	descripcionReceta VARCHAR(1000),
	fotoPrincipal VARCHAR(300),
	porciones INT,
	cantidadPersonas INT,
	idTipo INT,
	FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
	FOREIGN KEY (idTipo) REFERENCES tiposReceta(idTipo)
);

CREATE TABLE ingredientes (
	idIngrediente INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(200)
);

CREATE TABLE unidades (
	idUnidad INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE utilizados (
	idUtilizado INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	idReceta INT,
	idIngrediente INT,
	cantidad INT,
	idUnidad INT,
	observaciones VARCHAR(500),
	FOREIGN KEY (idReceta) REFERENCES recetas(idReceta),
	FOREIGN KEY (idIngrediente) REFERENCES ingredientes(idIngrediente),
	FOREIGN KEY (idUnidad) REFERENCES unidades(idUnidad)
);

CREATE TABLE calificaciones (
	idCalificacion INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	idUsuario INT,
	idReceta INT,
	calificacion INT,
	comentarios VARCHAR(500),
	FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
	FOREIGN KEY (idReceta) REFERENCES recetas(idReceta)
);

CREATE TABLE conversiones (
	idConversion INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	idUnidadOrigen INT NOT NULL,
	idUnidadDestino INT NOT NULL,
	factorConversiones FLOAT,
	FOREIGN KEY (idUnidadOrigen) REFERENCES unidades(idUnidad),
	FOREIGN KEY (idUnidadDestino) REFERENCES unidades(idUnidad)
);

CREATE TABLE pasos (
	idPaso INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	idReceta INT,
	nroPaso INT,
	texto VARCHAR(4000),
	FOREIGN KEY (idReceta) REFERENCES recetas(idReceta)
);

CREATE TABLE fotos (
	idFoto INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	idReceta INT NOT NULL,
	urlFoto VARCHAR(300),
	extension VARCHAR(5),
	FOREIGN KEY (idReceta) REFERENCES recetas(idReceta)
);

CREATE TABLE multimedia (
	idContenido INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	idPaso INT NOT NULL,
	tipo_contenido ENUM('foto', 'video', 'audio'),
	extension VARCHAR(5),
	urlContenido VARCHAR(300),
	FOREIGN KEY (idPaso) REFERENCES pasos(idPaso)
);

CREATE TABLE sedes (
	idSede INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	nombreSede VARCHAR(150) NOT NULL,
	direccionSede VARCHAR(250) NOT NULL,
	telefonoSede VARCHAR(15),
	mailSede VARCHAR(150),
	whatsApp VARCHAR(15),
	tipoBonificacion VARCHAR(20),
	bonificacionCursos DECIMAL(10,2),
	tipoPromocion VARCHAR(20),
	promocionCursos DECIMAL(10,2)
);

CREATE TABLE cursos (
	idCurso INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	descripcion VARCHAR(300),
	contenidos VARCHAR(500),
	requerimientos VARCHAR(500),
	duracion INT,
	precio DECIMAL(12,2),
	modalidad ENUM('presencial', 'remoto', 'virtual')
);

CREATE TABLE cronogramaCursos (
	idCronograma INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	idSede INT NOT NULL,
	idCurso INT NOT NULL,
	fechaInicio DATE,
	fechaFin DATE,
	vacantesDisponibles INT,
	FOREIGN KEY (idSede) REFERENCES sedes(idSede),
	FOREIGN KEY (idCurso) REFERENCES cursos(idCurso)
);

CREATE TABLE asistenciaCursos (
	idAsistencia INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	idAlumno INT NOT NULL,
	idCronograma INT NOT NULL,
	fecha DATETIME,
	FOREIGN KEY (idAlumno) REFERENCES alumnos(idAlumno),
	FOREIGN KEY (idCronograma) REFERENCES cronogramaCursos(idCronograma)
);