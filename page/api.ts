import http from '@/utils/http';
import iHttp from '@/utils/http/request';

type P<T> = Promise<iHttp.ParseResult<T>>
