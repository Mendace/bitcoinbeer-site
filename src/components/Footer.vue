<template>
	<footer class="px-4 divide-y bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
		<div class="container flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0">
			<div class="lg:w-1/3">
				<router-link to="/" class="flex justify-center space-x-3 lg:justify-start">
					<div class="flex items-center justify-center w-12 h-12 rounded-full">
						<img :src="logo" alt="Logo" class="w-12 h-12 object-cover" />
					</div>
					<span class="self-center text-2xl font-semibold dark:text-gray-200">
						{{ $t('footer.brandName') }}
					</span>
				</router-link>
			</div>
			<div class="grid grid-cols-2 text-sm gap-x-3 gap-y-8 lg:w-2/3 sm:grid-cols-4">
				<div class="space-y-3">
					<h3 class="tracking-wide uppercase text-gray-700 dark:text-gray-400">
						{{ $t('footer.product.title') }}
					</h3>
					<ul class="space-y-1">
						<li>
							<router-link to="/about" class="hover:text-gray-900 dark:hover:text-gray-300">
								{{ $t('footer.product.features') }}
							</router-link>
						</li>
						<li>
							<router-link to="/partners" class="hover:text-gray-900 dark:hover:text-gray-300">
								{{ $t('footer.product.pricing') }}
							</router-link>
						</li>
						<li>
							<router-link to="/faq" class="hover:text-gray-900 dark:hover:text-gray-300">
								{{ $t('footer.product.faq') }}
							</router-link>
						</li>
					</ul>
				</div>
				<div class="space-y-3">
					<h3 class="tracking-wide uppercase text-gray-700 dark:text-gray-400">
						{{ $t('footer.company.title') }}
					</h3>
					<ul class="space-y-1">
						<li>
							<router-link to="/privacy" class="hover:text-gray-900 dark:hover:text-gray-300">
								{{ $t('footer.company.privacy') }}
							</router-link>
						</li>
						<li>
							<router-link to="/terms" class="hover:text-gray-900 dark:hover:text-gray-300">
								{{ $t('footer.company.terms') }}
							</router-link>
						</li>
					</ul>
				</div>
				<div class="space-y-3">
					<h3 class="uppercase text-gray-700 dark:text-gray-400">
						{{ $t('footer.developers.title') }}
					</h3>
					<ul class="space-y-1">
						<li>
							<router-link to="/brands" class="hover:text-gray-900 dark:hover:text-gray-300">
								{{ $t('footer.developers.api') }}
							</router-link>
						</li>
            <li>
              <a
                  href="https://api.bitcoinbeer.events/api_users/signup_api_user.php"
                  class="hover:text-gray-900 dark:hover:text-gray-300"
                  target="_blank"
              >
                {{ $t('footer.developers.documentation') }}
              </a>
            </li>
						<li>
							<router-link to="/comingsoon" class="hover:text-gray-900 dark:hover:text-gray-300">
								{{ $t('footer.developers.guides') }}
							</router-link>
						</li>
					</ul>
				</div>
				<div class="space-y-3">
					<h3 class="uppercase text-gray-500">Social Media</h3>
					<div class="flex space-x-3">
						<a href="https://www.facebook.com/bitcoinbeeritalia/" target="_blank" title="Facebook"
							class="text-gray-500 hover:text-blue-500 transition-transform transform hover:scale-110">
							<i class="fab fa-facebook-f"></i>
						</a>
						<a href="https://www.instagram.com/bitcoinbeeritalia/" target="_blank" title="Instagram"
							class="text-gray-500 hover:text-pink-500 transition-transform transform hover:scale-110">
							<i class="fab fa-instagram"></i>
						</a>
						<a href="https://x.com/BitcoinBeerIT" target="_blank" title="X (Twitter)"
							class="text-gray-500 hover:text-blue-400 transition-transform transform hover:scale-110">
							<i class="fab fa-twitter"></i>
						</a>
						<a href="https://t.me/BitcoinBeerHub" target="_blank" title="Telegram"
							class="text-gray-500 hover:text-blue-600 transition-transform transform hover:scale-110">
							<i class="fab fa-telegram-plane"></i>
						</a>
						<a href="https://mastodon.social/@bitcoinbeer" target="_blank" title="Mastodon"
							class="text-gray-500 hover:text-purple-500 transition-transform transform hover:scale-110">
							<i class="fab fa-mastodon"></i>
						</a>
					</div>
				</div>
			</div>
		</div>
		<div class="py-6 text-sm text-center text-gray-600 dark:text-gray-500">
			{{ $t('footer.copyright') }} <br /> <br />
      Made with ❤️ in Europe 🇪🇺
		</div>

  </footer>
</template>


<script>
import logo from '/logos/marker.webp';

export default {
	name: "Footer",
	data() {
		return {
			logo,
			socialLinks: {
				facebook: "https://facebook.com",
				instagram: "https://instagram.com",
				x: "https://twitter.com",
				telegram: "https://t.me/BitcoinBeerHub",
				mastodon: "https://mastodon.social",
			},
		};
	},
};
</script>

<style scoped>
footer {
	backdrop-filter: blur(10px);
	background: linear-gradient(135deg, #000000, #121212);

}
</style>