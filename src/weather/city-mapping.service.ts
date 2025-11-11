import { Injectable } from '@nestjs/common';

@Injectable()
export class CityMappingService {
  private readonly cityMap = new Map<string, string>([
    // 中文城市名 -> 英文城市名
    ['北京', 'Beijing'],
    ['上海', 'Shanghai'],
    ['广州', 'Guangzhou'],
    ['深圳', 'Shenzhen'],
    ['西安', 'Xi\'an'],
    ['杭州', 'Hangzhou'],
    ['南京', 'Nanjing'],
    ['武汉', 'Wuhan'],
    ['重庆', 'Chongqing'],
    ['成都', 'Chengdu'],
    ['苏州', 'Suzhou'],
    ['天津', 'Tianjin'],
    ['长沙', 'Changsha'],
    ['沈阳', 'Shenyang'],
    ['哈尔滨', 'Harbin'],
    ['郑州', 'Zhengzhou'],
    ['福州', 'Fuzhou'],
    ['厦门', 'Xiamen'],
    ['青岛', 'Qingdao'],
    ['大连', 'Dalian'],
    ['宁波', 'Ningbo'],
    ['南昌', 'Nanchang'],
    ['太原', 'Taiyuan'],
    ['合肥', 'Hefei'],
    ['石家庄', 'Shijiazhuang'],
    ['贵阳', 'Guiyang'],
    ['昆明', 'Kunming'],
    ['南宁', 'Nanning'],
    ['兰州', 'Lanzhou'],
    ['乌鲁木齐', 'Urumqi'],
  ]);

  /**
   * 将城市名转换为英文名称
   * 如果输入已是英文或未找到映射，则返回原值
   */
  public getCityEnglishName(cityName: string): string {
    const trimmed = cityName.trim();
    return this.cityMap.get(trimmed) || trimmed;
  }

  /**
   * 获取所有支持的城市列表
   */
  public getSupportedCities(): string[] {
    return Array.from(this.cityMap.keys());
  }
}
