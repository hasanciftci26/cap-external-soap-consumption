using {BusinessUsers as bu} from '../db/data-models';

service BusinessUsersSrv {
    entity BusinessUsers as projection on bu;
};
