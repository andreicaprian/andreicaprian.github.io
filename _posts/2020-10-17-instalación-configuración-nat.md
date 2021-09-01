---
title: Instalación y configuración NAT
author: Andrei Caprian
date: 2020-10-17 20:55:00 +0800
categories: [Posts, NAT]
tags: [Posts]
pin: false
---

## Introducción
Este proyecto tiene como objetivo simular un supuesto real de un colegio que compra un servidor y un dominio. Se explicará la configuración que se debe realizar en cada momento acompañadas de capturas de pantalla. En este supuesto se trabajará con VirtualBox para crear las máquinas virtuales, tanto el servidor como los clientes, en este caso utilizaré un servidor Debian sin entorno gráfico, un cliente Debian con entorno gráfico (xfce) y un Windows 7.

## Inicio del proyecto
El colegio CEIP Europa Nazareno ha comprado un servidor, y un dominio con el nombre ceipeuropanazareno.org.
En el servidor se va instalar una distribución Debian, y siguiendo este esquema de red:
![esquema-de-red](https://static.wixstatic.com/media/38a6c2_722bc29e8dea436fad2e3115355ff428~mv2.png){: width="1366" height="354"}

El servidor Debian tendrá el nombre Europa, estará configurado de manera que una tarjeta de red tenga una configuración con IP Pública y DHCP automático y la otra tarjeta de red tenga una configuración con IP Privada y estática. Este servidor actuará como enrutador para que las máquinas clientes puedan navegar por internet. 

Para modificar el nombre tenemos que configurar los archivos /etc/host y /etc/hostname y además utilizar el siguiente comando para cambiar el nombre de usuario.

```console
   root@ceipeuropanazareno:~# usermod -l Europa usuario
```

### Configuración en VirtualBox del Servidor Debian
El Adaptador 1 debe estar como Adaptador puente.
![adaptador-puente](https://static.wixstatic.com/media/38a6c2_cf314114bd4d488f929dcc772d988a1e~mv2.png){: width="1366" height="354"}
Y el Adaptador 2 debe estar como Red interna.
![red-interna](https://static.wixstatic.com/media/38a6c2_10fdb33ee0e44e4fb81864f3c8d706b4~mv2.png){: width="1366" height="354"}

### Configuración dentro del Servidor Debian
Dentro de la configuración del archivo /etc/sysctl.conf debemos de descomentar la siguiente línea:
```console
   root@ceipeuropanazareno:~# nano /etc/sysctl.conf
```
![systctl-conf](https://static.wixstatic.com/media/38a6c2_a38f49b0449349f99fe1e94d49c2a31b~mv2.png){: width="1366" height="354"}

Dentro de la configuración del archivo /etc/network/interfaces debemos añadir lo siguiente:
```console
   root@ceipeuropanazareno:~# nano /etc/network/interfaces
```
![network-interfaces-conf](https://static.wixstatic.com/media/38a6c2_e7d1f43d12934ec0b95ebbf96cb6b970~mv2.png){: width="1366" height="354"}
```shell
# The primary network interface
allow-hotplug enp0s3
iface enp0s3 inet dhcp
# Second interface
allow-hotplug enp0s8
auto enp0s8
iface enp0s8 inet static
address 192.168.10.254
netmask 255.255.255.0

up iptables -t nat -A POSTROUTING -o enp0s3 -s 192.168.10.0/24 -j MASQUERADE
down iptables -t nat -D POSTROUTING -o enp0s3 -s 192.168.10.0/24 -j MASQUERADE
```
Donde pone primary network interface (esta es mi tarjeta de red que sale a internet) y donde pone second interface (esta es mi tarjeta de red que comunica con la red interna de los clientes).

Explicación de las iptables: se pone la tarjeta de red por la que los ordenadores de la red interna van tener que usar para salir a internet (en mi caso la tarjeta de red enp0s3), luego se pone la dirección de red de la red interna para que las peticiones de los ordenadores vayan a la tarjeta de red que sale a internet.

Aclaración: Para identificar cada tarjeta de red, utilizamos el comando ip a. Por ejemplo en mi caso me pone que la tarjeta de red enp0s3 tiene una ip 192.168.139, en este caso es la ip que sale a internet. Y la tarjeta de red enp0s8 con ip 192.168.10.254 es la que se comunica con la red interna.
![ipa](https://static.wixstatic.com/media/a27d24_b36c91f7fcd84b8cbfaaa0030c384a15~mv2.jpg){: width="1366" height="354"}

### Configuración de los Clientes
Deben tener como Adaptador 1 el modo Red interna.
![red-interna](https://static.wixstatic.com/media/38a6c2_73d0659c543145308147d602d8852475~mv2.png){: width="1366" height="354"}

Tanto en el cliente Windows 7 como en el cliente Debian se debe poner la siguiente configuración ip manual:
```shell  
IP Windows 7 192.168.10.2, IP Debian 192.168.10.3
Máscara de red 255.255.255.0
Puerta de enlace 192.168.10.254
Servidores DNS 192.168.202.2, 192.168.204.2
Servidores DNS 8.8.8.8, 8.8.4.4

```
Se elegirá los servidores DNS dependiendo de si existen en la red del colegio (192.168.202.2, 192.168.204.2) o si necesitan unos públicos (8.8.8.8, 8.8.4.4).
![conf-windows-ip1](https://static.wixstatic.com/media/38a6c2_9633bfed990f44feae0f8c5db26d6ec1~mv2.png){: width="1366" height="354"}
![conf-windows-ip2](https://static.wixstatic.com/media/38a6c2_4fbd215effd44d2587b1cf2bcd2c4582~mv2.png){: width="1366" height="354"}
![conf-debian-ip1](https://static.wixstatic.com/media/38a6c2_76c75bc4bf8a4ecf868fea7d4918ba43~mv2.png){: width="1366" height="354"}
![conf-debian-ip2](https://static.wixstatic.com/media/38a6c2_e73779808bbe4b91b143fb4f30f71994~mv2.png){: width="1366" height="354"}

### Pruebas de funcionamiento
Para las pruebas usaré el comando ping. Y al final pondré una captura de pantalla del funcionamiento correcto de las máquinas navegando en internet.
En el servidor Debian:
![pruebas-servidor-debian](https://static.wixstatic.com/media/38a6c2_02a8dba9188047ed819e0e3737ded835~mv2.png){: width="1366" height="354"}
En el cliente Debian:
![pruebas-cliente-debian](https://static.wixstatic.com/media/38a6c2_a321ad01d2ad45069a175f6425b53e39~mv2.png){: width="1366" height="354"}
En el cliente Windows 7:
![pruebas-cliente-windows](https://static.wixstatic.com/media/38a6c2_e663dce466ef4b0c8aa33c170e6ab1d3~mv2.png){: width="1366" height="354"}
Prueba de funcionamiento por navegación en internet:
![pruebas-internet](https://static.wixstatic.com/media/38a6c2_de445670907b4d4e8b316317abc8f6de~mv2.png){: width="1366" height="354"}

