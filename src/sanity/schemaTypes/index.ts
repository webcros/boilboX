import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import {mealType} from './mealType'
import {impactReportType} from './impactReportType'
import {testimonialType} from './testimonialType'
import {storyType} from './storyType'
import {partnerType} from './partnerType'
import {locationType} from './locationType'
import {userType} from './userType'
import {liveKitchenVideoType} from './liveKitchenVideoType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, postType, authorType, mealType, impactReportType, testimonialType, storyType, partnerType, locationType, userType, liveKitchenVideoType],
}
