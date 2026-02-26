import {PrivilegeDto} from "./PrivilegeDtos";

export class PackageDto {

  id: number;
  name: string
  price: number;
  description: string;
  currency: string;
  active: boolean;
}

export class PackageFetchDto {
  packages: PackageDto[];
}

export class PackageCreateDto {
  name: string;
  description?: string;
  price: number;
  privileges: PrivilegeDto[];
}

export class PackageUpdateDto{
  name?:string;
  description?:string;
  price?:number;
}
