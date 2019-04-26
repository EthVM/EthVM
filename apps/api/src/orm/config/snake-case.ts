import {snakeCase} from 'typeorm/util/StringUtils';
import {DefaultNamingStrategy} from 'typeorm';

export class SnakeCaseNamingStrategy extends DefaultNamingStrategy {

    tableName(targetName: string, userSpecifiedName: string): string {
        return userSpecifiedName ? userSpecifiedName : snakeCase(targetName);
    }

    columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
        return snakeCase(embeddedPrefixes.concat(customName ? customName : propertyName).join('_'));
    }

    relationName(propertyName: string): string {
        return snakeCase(propertyName);
    }
}
