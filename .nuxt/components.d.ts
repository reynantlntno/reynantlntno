
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'SkillsList': typeof import("../src/components/about/SkillsList.vue")['default']
    'AppointmentCalendar': typeof import("../src/components/appointments/AppointmentCalendar.vue")['default']
    'AppointmentForm': typeof import("../src/components/appointments/AppointmentForm.vue")['default']
    'BlogCard': typeof import("../src/components/blog/BlogCard.vue")['default']
    'BlogList': typeof import("../src/components/blog/BlogList.vue")['default']
    'BlogMarkdownRenderer': typeof import("../src/components/blog/BlogMarkdownRenderer.vue")['default']
    'AppFooter': typeof import("../src/components/common/AppFooter.vue")['default']
    'AppHeader': typeof import("../src/components/common/AppHeader.vue")['default']
    'BaseButton': typeof import("../src/components/common/BaseButton.vue")['default']
    'BaseDropdown': typeof import("../src/components/common/BaseDropdown.vue")['default']
    'BaseInput': typeof import("../src/components/common/BaseInput.vue")['default']
    'BaseSearch': typeof import("../src/components/common/BaseSearch.vue")['default']
    'LoadingSpinner': typeof import("../src/components/common/LoadingSpinner.vue")['default']
    'Pagination': typeof import("../src/components/common/Pagination.vue")['default']
    'ParticleBackground': typeof import("../src/components/common/ParticleBackground.vue")['default']
    'ScrollIndicator': typeof import("../src/components/common/ScrollIndicator.vue")['default']
    'ThemeToggle': typeof import("../src/components/common/ThemeToggle.vue")['default']
    'ToastNotification': typeof import("../src/components/common/ToastNotification.vue")['default']
    'ProjectCard': typeof import("../src/components/projects/ProjectCard.vue")['default']
    'ProjectGallery': typeof import("../src/components/projects/ProjectGallery.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'ColorScheme': typeof import("../node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']
    'NuxtPage': typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
      'LazySkillsList': LazyComponent<typeof import("../src/components/about/SkillsList.vue")['default']>
    'LazyAppointmentCalendar': LazyComponent<typeof import("../src/components/appointments/AppointmentCalendar.vue")['default']>
    'LazyAppointmentForm': LazyComponent<typeof import("../src/components/appointments/AppointmentForm.vue")['default']>
    'LazyBlogCard': LazyComponent<typeof import("../src/components/blog/BlogCard.vue")['default']>
    'LazyBlogList': LazyComponent<typeof import("../src/components/blog/BlogList.vue")['default']>
    'LazyBlogMarkdownRenderer': LazyComponent<typeof import("../src/components/blog/BlogMarkdownRenderer.vue")['default']>
    'LazyAppFooter': LazyComponent<typeof import("../src/components/common/AppFooter.vue")['default']>
    'LazyAppHeader': LazyComponent<typeof import("../src/components/common/AppHeader.vue")['default']>
    'LazyBaseButton': LazyComponent<typeof import("../src/components/common/BaseButton.vue")['default']>
    'LazyBaseDropdown': LazyComponent<typeof import("../src/components/common/BaseDropdown.vue")['default']>
    'LazyBaseInput': LazyComponent<typeof import("../src/components/common/BaseInput.vue")['default']>
    'LazyBaseSearch': LazyComponent<typeof import("../src/components/common/BaseSearch.vue")['default']>
    'LazyLoadingSpinner': LazyComponent<typeof import("../src/components/common/LoadingSpinner.vue")['default']>
    'LazyPagination': LazyComponent<typeof import("../src/components/common/Pagination.vue")['default']>
    'LazyParticleBackground': LazyComponent<typeof import("../src/components/common/ParticleBackground.vue")['default']>
    'LazyScrollIndicator': LazyComponent<typeof import("../src/components/common/ScrollIndicator.vue")['default']>
    'LazyThemeToggle': LazyComponent<typeof import("../src/components/common/ThemeToggle.vue")['default']>
    'LazyToastNotification': LazyComponent<typeof import("../src/components/common/ToastNotification.vue")['default']>
    'LazyProjectCard': LazyComponent<typeof import("../src/components/projects/ProjectCard.vue")['default']>
    'LazyProjectGallery': LazyComponent<typeof import("../src/components/projects/ProjectGallery.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyColorScheme': LazyComponent<typeof import("../node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const SkillsList: typeof import("../src/components/about/SkillsList.vue")['default']
export const AppointmentCalendar: typeof import("../src/components/appointments/AppointmentCalendar.vue")['default']
export const AppointmentForm: typeof import("../src/components/appointments/AppointmentForm.vue")['default']
export const BlogCard: typeof import("../src/components/blog/BlogCard.vue")['default']
export const BlogList: typeof import("../src/components/blog/BlogList.vue")['default']
export const BlogMarkdownRenderer: typeof import("../src/components/blog/BlogMarkdownRenderer.vue")['default']
export const AppFooter: typeof import("../src/components/common/AppFooter.vue")['default']
export const AppHeader: typeof import("../src/components/common/AppHeader.vue")['default']
export const BaseButton: typeof import("../src/components/common/BaseButton.vue")['default']
export const BaseDropdown: typeof import("../src/components/common/BaseDropdown.vue")['default']
export const BaseInput: typeof import("../src/components/common/BaseInput.vue")['default']
export const BaseSearch: typeof import("../src/components/common/BaseSearch.vue")['default']
export const LoadingSpinner: typeof import("../src/components/common/LoadingSpinner.vue")['default']
export const Pagination: typeof import("../src/components/common/Pagination.vue")['default']
export const ParticleBackground: typeof import("../src/components/common/ParticleBackground.vue")['default']
export const ScrollIndicator: typeof import("../src/components/common/ScrollIndicator.vue")['default']
export const ThemeToggle: typeof import("../src/components/common/ThemeToggle.vue")['default']
export const ToastNotification: typeof import("../src/components/common/ToastNotification.vue")['default']
export const ProjectCard: typeof import("../src/components/projects/ProjectCard.vue")['default']
export const ProjectGallery: typeof import("../src/components/projects/ProjectGallery.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const ColorScheme: typeof import("../node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazySkillsList: LazyComponent<typeof import("../src/components/about/SkillsList.vue")['default']>
export const LazyAppointmentCalendar: LazyComponent<typeof import("../src/components/appointments/AppointmentCalendar.vue")['default']>
export const LazyAppointmentForm: LazyComponent<typeof import("../src/components/appointments/AppointmentForm.vue")['default']>
export const LazyBlogCard: LazyComponent<typeof import("../src/components/blog/BlogCard.vue")['default']>
export const LazyBlogList: LazyComponent<typeof import("../src/components/blog/BlogList.vue")['default']>
export const LazyBlogMarkdownRenderer: LazyComponent<typeof import("../src/components/blog/BlogMarkdownRenderer.vue")['default']>
export const LazyAppFooter: LazyComponent<typeof import("../src/components/common/AppFooter.vue")['default']>
export const LazyAppHeader: LazyComponent<typeof import("../src/components/common/AppHeader.vue")['default']>
export const LazyBaseButton: LazyComponent<typeof import("../src/components/common/BaseButton.vue")['default']>
export const LazyBaseDropdown: LazyComponent<typeof import("../src/components/common/BaseDropdown.vue")['default']>
export const LazyBaseInput: LazyComponent<typeof import("../src/components/common/BaseInput.vue")['default']>
export const LazyBaseSearch: LazyComponent<typeof import("../src/components/common/BaseSearch.vue")['default']>
export const LazyLoadingSpinner: LazyComponent<typeof import("../src/components/common/LoadingSpinner.vue")['default']>
export const LazyPagination: LazyComponent<typeof import("../src/components/common/Pagination.vue")['default']>
export const LazyParticleBackground: LazyComponent<typeof import("../src/components/common/ParticleBackground.vue")['default']>
export const LazyScrollIndicator: LazyComponent<typeof import("../src/components/common/ScrollIndicator.vue")['default']>
export const LazyThemeToggle: LazyComponent<typeof import("../src/components/common/ThemeToggle.vue")['default']>
export const LazyToastNotification: LazyComponent<typeof import("../src/components/common/ToastNotification.vue")['default']>
export const LazyProjectCard: LazyComponent<typeof import("../src/components/projects/ProjectCard.vue")['default']>
export const LazyProjectGallery: LazyComponent<typeof import("../src/components/projects/ProjectGallery.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyColorScheme: LazyComponent<typeof import("../node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<IslandComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>>

export const componentNames: string[]
