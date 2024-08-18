import slugifyFunction from 'slugify';

export function slugify(name: string): string {
  return slugifyFunction(name, {
    lower: true,
    locale: 'vi',
    trim: true,
  });
}
