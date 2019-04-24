import moment from 'moment'; 
import 'moment/locale/zh-cn';

export function fromNow(time) {
  moment.locale('zh-cn');
  return moment(time, "YYYY-MM-DDThh:mm:ss").fromNow()
}

export function now() {
  moment.locale('zh-cn');
  return moment().format('LT');
}

