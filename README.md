# barechechrono-es

Utilidades mínimas para fechas en JavaScript (ES/ISO) - Una librería ligera y simple para manipulación de fechas.

## 📋 Descripción

`barechechrono-es` es una librería de utilidades para fechas escrita en JavaScript puro (ESM) que proporciona funciones esenciales para la manipulación, formateo y comparación de fechas. Está diseñada para ser ligera, sin dependencias externas y con soporte para semanas ISO-8601.

## 🚀 Características

- ✅ **Sin dependencias** - JavaScript puro
- ✅ **ESM nativo** - Soporte completo para módulos ES
- ✅ **Semanas ISO-8601** - Implementación estándar de semanas
- ✅ **Formateo básico** - Tokens simples para formateo de fechas
- ✅ **Manipulación de fechas** - Suma, resta y comparaciones
- ✅ **Tiempo relativo** - Formateo en español ("hace X", "en X")
- ✅ **Validación** - Verificación de fechas válidas
- ✅ **Ligero** - Mínimo overhead

## 📦 Instalación

```bash
npm install barechechrono-es
```

## 🔧 Uso

### Importación

```javascript
import { 
  toDate, 
  format, 
  add, 
  sub, 
  diff, 
  isBefore, 
  isAfter, 
  startOf, 
  endOf, 
  weekOfYear,
  relativeTime 
} from 'barechechrono-es';
```

## 📚 API

### Conversión y Validación

#### `toDate(input)`
Convierte cualquier entrada a un objeto Date.

```javascript
toDate('2024-01-15')     // Date object
toDate(1705276800000)    // Date object
toDate(new Date())       // Clon del Date
```

#### `isValid(input)`
Verifica si una fecha es válida.

```javascript
isValid('2024-01-15')    // true
isValid('fecha-inválida') // false
isValid(new Date('invalid')) // false
```

#### `parseISO(iso)`
Parsea una cadena ISO y devuelve Date o null.

```javascript
parseISO('2024-01-15T10:30:00Z') // Date object
parseISO('fecha-inválida')       // null
```

### Formateo

#### `format(dateInput, pattern)`
Formatea una fecha usando tokens básicos.

**Tokens disponibles:**
- `YYYY` - Año (4 dígitos)
- `MM` - Mes (01-12)
- `DD` - Día (01-31)
- `HH` - Hora (00-23)
- `mm` - Minutos (00-59)
- `ss` - Segundos (00-59)

```javascript
const fecha = new Date('2024-01-15T14:30:45');

format(fecha, 'YYYY-MM-DD')           // "2024-01-15"
format(fecha, 'DD/MM/YYYY HH:mm')     // "15/01/2024 14:30"
format(fecha, 'YYYY-MM-DD HH:mm:ss')  // "2024-01-15 14:30:45"
```

### Manipulación de Fechas

#### `add(dateInput, duration)`
Suma tiempo a una fecha.

```javascript
const fecha = new Date('2024-01-15');

add(fecha, { days: 7 })      // +7 días
add(fecha, { months: 1 })    // +1 mes
add(fecha, { years: 1 })     // +1 año
add(fecha, { hours: 2 })     // +2 horas
```

#### `sub(dateInput, duration)`
Resta tiempo de una fecha.

```javascript
const fecha = new Date('2024-01-15');

sub(fecha, { days: 7 })      // -7 días
sub(fecha, { months: 1 })    // -1 mes
```

### Comparación y Diferencias

#### `diff(a, b, unit)`
Calcula la diferencia entre dos fechas.

```javascript
const fecha1 = new Date('2024-01-15');
const fecha2 = new Date('2024-01-22');

diff(fecha2, fecha1, 'd')    // 7 (días)
diff(fecha2, fecha1, 'h')    // 168 (horas)
diff(fecha2, fecha1, 'ms')   // 604800000 (milisegundos)
```

#### `isBefore(a, b)`, `isAfter(a, b)`, `isEqual(a, b)`
Compara fechas.

```javascript
const fecha1 = new Date('2024-01-15');
const fecha2 = new Date('2024-01-22');

isBefore(fecha1, fecha2)     // true
isAfter(fecha1, fecha2)      // false
isEqual(fecha1, fecha1)      // true
```

### Inicio y Fin de Períodos

#### `startOf(dateInput, unit)`
Obtiene el inicio de un período.

```javascript
const fecha = new Date('2024-01-15T14:30:45');

startOf(fecha, 'year')       // 2024-01-01 00:00:00
startOf(fecha, 'month')      // 2024-01-01 00:00:00
startOf(fecha, 'week')       // 2024-01-15 00:00:00 (lunes)
startOf(fecha, 'day')        // 2024-01-15 00:00:00
startOf(fecha, 'hour')       // 2024-01-15 14:00:00
```

#### `endOf(dateInput, unit)`
Obtiene el final de un período.

```javascript
const fecha = new Date('2024-01-15T14:30:45');

endOf(fecha, 'year')         // 2024-12-31 23:59:59
endOf(fecha, 'month')        // 2024-01-31 23:59:59
endOf(fecha, 'week')         // 2024-01-21 23:59:59 (domingo)
endOf(fecha, 'day')          // 2024-01-15 23:59:59
```

### Semanas ISO

#### `weekOfYear(dateInput)`
Obtiene el número de semana ISO-8601.

```javascript
const fecha = new Date('2024-01-15');
weekOfYear(fecha)            // 3 (tercera semana del año)
```

### Tiempo Relativo

#### `relativeTime(to, from)`
Formatea fechas en tiempo relativo en español.

```javascript
const ahora = new Date();
const hace5Min = sub(ahora, { minutes: 5 });
const en2Horas = add(ahora, { hours: 2 });

relativeTime(hace5Min)       // "hace 5 min"
relativeTime(en2Horas)       // "en 2 h"
relativeTime(ahora)          // "justo ahora"
```

### Utilidades Adicionales

#### `clamp(dateInput, min, max)`
Limita una fecha entre un mínimo y máximo.

```javascript
const fecha = new Date('2024-01-15');
const min = new Date('2024-01-10');
const max = new Date('2024-01-20');

clamp(fecha, min, max)       // 2024-01-15 (sin cambios)
clamp(new Date('2024-01-05'), min, max) // 2024-01-10 (limitado al mínimo)
```

## 🎯 Ejemplos de Uso

### Calcular edad

```javascript
import { diff, parseISO } from 'barechechrono-es';

function calcularEdad(fechaNacimiento) {
  const nacimiento = parseISO(fechaNacimiento);
  const hoy = new Date();
  return Math.floor(diff(hoy, nacimiento, 'd') / 365);
}

calcularEdad('1990-05-15'); // 33 (aproximado)
```

### Formatear fechas para mostrar

```javascript
import { format, relativeTime } from 'barechechrono-es';

function formatearFecha(fecha) {
  const ahora = new Date();
  const diffDias = Math.abs(diff(fecha, ahora, 'd'));
  
  if (diffDias < 1) {
    return relativeTime(fecha);
  } else if (diffDias < 7) {
    return format(fecha, 'DD/MM HH:mm');
  } else {
    return format(fecha, 'DD/MM/YYYY');
  }
}
```

### Obtener rango de fechas

```javascript
import { startOf, endOf, add } from 'barechechrono-es';

function obtenerSemanaActual() {
  const hoy = new Date();
  return {
    inicio: startOf(hoy, 'week'),
    fin: endOf(hoy, 'week')
  };
}

function obtenerMesSiguiente() {
  const hoy = new Date();
  const proximoMes = add(hoy, { months: 1 });
  return {
    inicio: startOf(proximoMes, 'month'),
    fin: endOf(proximoMes, 'month')
  };
}
```

## 📝 Notas

- **Semanas ISO**: Las semanas comienzan en lunes según el estándar ISO-8601
- **Zona horaria**: Todas las operaciones usan la zona horaria local del sistema
- **Validación**: Las funciones lanzan errores para fechas inválidas
- **Inmutabilidad**: Las funciones devuelven nuevos objetos Date, no modifican los originales

## 📄 Licencia

ISC

## 👨‍💻 Autor

Brian Areche <arecheminayabj@gmail.com>

---

*Una librería simple y eficiente para todas tus necesidades de manipulación de fechas en JavaScript.*