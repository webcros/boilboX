import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Menu')
        .child(
          S.documentTypeList('meal')
            .title('Meals')
            .filter('_type == "meal"')
        ),
      S.divider(),
      S.listItem()
        .title('Blog')
        .child(
          S.list()
            .title('Blog Content')
            .items([
              S.documentTypeListItem('post').title('Posts'),
              S.documentTypeListItem('category').title('Categories'),
              S.documentTypeListItem('author').title('Authors'),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('Live Kitchen Videos')
        .child(
          S.documentTypeList('liveKitchenVideo')
            .title('Live Kitchen Videos')
            .filter('_type == "liveKitchenVideo"')
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['meal', 'post', 'category', 'author', 'liveKitchenVideo'].includes(item.getId()!),
      ),
    ])
