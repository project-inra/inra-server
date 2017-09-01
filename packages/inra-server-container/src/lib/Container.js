import { ContainerInterface } from "./ContainerInterface";

/**
 * The container is a component that implements Service Location of services and
 * it's itself a container for them. Since the server is highly decoupled, it is
 * essential to integrate different components. The developer can also use this
 * component to inject dependencies and manage global instances of the different
 * classes used in the application.
 *
 * Basically, this component implements the "Inversion of Control" pattern: the
 * objects do not receive their dependencies using setters or constructors, but
 * requesting a service dependency injector. This reduces the overall complexity
 * since there is only one way to get the required dependencies within a
 * component. Additionally, this pattern increases testability in the code, thus
 * making it less prone to errors.
 *
 * @todo We should make it more like a dependency-inector, pheraps with
 *       dependency resolving etc.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 * @see https://docs.microsoft.com/en-us/scripting/javascript/reference/map-object-javascript
 * @see https://en.wikipedia.org/wiki/Inversion_of_control
 */

class Container extends Map implements ContainerInterface {
    get( key: string, defaultValue: any ): any {
        return super.get( key ) || defaultValue;
    }
}

export default Container;
