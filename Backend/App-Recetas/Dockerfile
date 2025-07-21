# 1) Stage de compilación con Maven
FROM maven:3.8.8-eclipse-temurin-21 AS build
WORKDIR /app

# Copiamos el pom primero y bajamos dependencias (cache)
COPY pom.xml .
RUN mvn dependency:go-offline

# Ahora copiamos el código y lo compilamos
COPY src ./src
RUN mvn package -DskipTests

# 2) Stage de runtime con JRE más ligero
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copiamos el jar empaquetado desde el build-stage
COPY --from=build /app/target/*.jar app-recetas.jar

# Puerto en el que corre tu aplicación
EXPOSE 8080

# Comando que arranca Spring Boot
ENTRYPOINT ["java","-jar","app-recetas.jar"]
