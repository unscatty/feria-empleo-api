export const getEnumKeyByEnumValue = <TEnumKey extends string, TEnumVal extends string | number>(
  _enum_: { [key in TEnumKey]: TEnumVal },
  value: TEnumVal
): TEnumKey => {
  const key = Object.keys(_enum_)[Object.values(_enum_).indexOf(value)];

  return key as keyof typeof _enum_;
};

export const toEnum = <TEnumKey extends string, TEnumVal extends string | number>(
  _enum_: { [key in TEnumKey]: TEnumVal },
  value: TEnumVal | string | number
): TEnumVal => {
  const enumKey = getEnumKeyByEnumValue(_enum_, value);

  if (!enumKey) {
    throw `${value} is not a value of this enum`;
  }

  return _enum_[enumKey];
};

export const stringToEnum = <TEnumKey extends string, TEnumVal extends string | number>(
  _enum_: { [key in TEnumKey]: TEnumVal },
  _key: string
): TEnumVal => {
  const value = _enum_[_key as TEnumKey];

  if (value === undefined) throw `Key ${_key} is not a valid key for this enum`;

  return value;
};
