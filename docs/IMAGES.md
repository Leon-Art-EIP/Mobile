# IMAGES

To import images, especially icons, please do not download and import them as `Image`. Instead, use the [`react-native-vector-icons`](https://github.com/oblador/react-native-vector-icons) library.  
  
You will find every icon of this library [here](https://oblador.github.io/react-native-vector-icons/).

### Example

Let's say you want to use the "home" icon from MaterialIcons. First, import it:  
```javascript
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
```
Then, use it as a component:
```javascript
<MaterialIcons name='home' />
```

You can also precise many arguments:

| Prop | Type | Example | Required | Default |
|-|-|-|-|-|
| name | string | `<MaterialIcons name="home" />` | Yes | "None" |
| size | number | `<MaterialIcons size={24} />` | No | 12 |
| color | string | `<MaterialIcons color='#fff' />` | No | *Inherited* |

And also all the `Text` props. See [the react-native documentation](https://reactnative.dev/docs/text.html).

### Why do we use this library ?

The biggest advantage of this icon pack library is that you have many many icons, and they are rendered as a font, so you can change their color dynamically, instead of having too many files in your `assets/` directory.
