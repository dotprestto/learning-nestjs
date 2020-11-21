## Descrição

Este projeto foi feito para aprender [NestJS](https://nestjs.com). O tutorial utilizado pode ser encontrado em:
- [Construindo uma API com NestJS, PostgreSQL e Docker — Parte 1: Criando nosso primeiro endpoint](https://medium.com/@iago.maiasilva/construindo-uma-api-com-nestjs-postgresql-e-docker-parte-1-criando-nosso-primeiro-endpoint-248d4b8ecc9c).
- [Parte 2: Autenticação e Autorização](https://medium.com/@iago.maiasilva/construindo-uma-api-com-nestjs-postgresql-e-docker-parte-2-autenticação-e-autorização-697f77afcc16)
- [Parte 3: Finalizando nosso CRUD de usuários](https://medium.com/@iago.maiasilva/construindo-uma-api-com-nestjs-postgresql-e-docker-parte-3-finalizando-nosso-crud-de-usu%C3%A1rios-bc056a7e049f)
- [Parte 4: Adicionando logs à nossa aplicação](https://medium.com/@iago.maiasilva/construindo-uma-api-com-nestjs-postgresql-e-docker-parte-4-adicionando-logs-à-nossa-aplicação-576ce4f9cc52)
- [Parte 5: Enviando emails de confirmação e recuperação de senha](https://medium.com/@iago.maiasilva/construindo-uma-api-com-nestjs-postgresql-e-docker-parte-5-enviando-emails-de-confirma%C3%A7%C3%A3o-e-54cb977c3fad)
- [Parte 6: Escrevendo testes](https://medium.com/@iago.maiasilva/construindo-uma-api-com-nestjs-postgresql-e-docker-parte-6-escrevendo-testes-ee23ca05f918)
- [Parte 7: Deploy!](https://medium.com/@iago.maiasilva/construindo-uma-api-com-nestjs-postgresql-e-docker-parte-7-deploy-2dab71caa0c7)

## Instalação

```bash
$ npm install
```

## Iniciar aplicação

```bash
# postgres database
$ docker-compose up -d

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

**OBS**: Os dados de usuário e senha precisam ser modificados em [mailer.config.ts](./src/configs/mailer.config.ts)

## Testes

```bash
# unit tests
$ npm run test:watch
```