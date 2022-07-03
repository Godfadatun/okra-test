import { Injectable } from '@nestjs/common';
import { CreateUtilDto } from './dto/create-util.dto';
import { UpdateUtilDto } from './dto/update-util.dto';

@Injectable()
export class UtilsService {
  snakeCase(text: string) {
    return text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join('_');
  }

  findAll() {
    return `This action returns all utils`;
  }

  detectObject(obj: any) {
    if (Object.prototype.toString.call(obj) === '[object Object]') {
      return true;
    }
    return false;
  }

  propertyNameConverter(converterFn: (s: string) => string) {
    (data: any): { [key: string]: any } => {
      const recursive = (obj: any): any => {
        if (!this.detectObject(data)) {
          return data;
        }
        const keys = Object.keys(obj);
        return keys.reduce(
          (accum: { [key: string]: any }, propName: string) => {
            const propValue = obj[propName];
            return {
              ...accum,
              [converterFn(propName)]: Array.isArray(propValue)
                ? propValue.map((x) =>
                    this.detectObject(x) ? recursive(x) : x,
                  )
                : this.detectObject(propValue)
                ? recursive(propValue)
                : propValue,
            };
          },
          {},
        );
      };
      return recursive(data);
    };
  }

  public toSnake = this.propertyNameConverter(this.snakeCase);

  toSnakeCase(obj: any) {
    const newObj: any = {};
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const keyCamel = this.snakeCase(key);
        newObj[keyCamel] = value;
      }
    }
    return newObj;
  }

  findOne(id: number) {
    return `This action returns a #${id} util`;
  }

  update(id: number, updateUtilDto: UpdateUtilDto) {
    return `This action updates a #${id} util`;
  }

  remove(id: number) {
    return `This action removes a #${id} util`;
  }

  async errorHandler(error, res) {
    res.status(error.response.status || 400).json({
      status: false,
      message:
        error.response.data.message || error.request.messaged || 'Failed',
      data: error.response.data || error.request || error.message,
    });
  }

  sendObjectResponse(message: string, data?: any) {
    return {
      status: true,
      message,
      data: data,
    };
  }
}
