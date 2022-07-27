// carousel
	function carousel(){
		let containers = document.querySelectorAll(".wfd--carousel");

		containers.forEach(container => {
			let cards = container.querySelectorAll(".wfd--card"),
					cardContainer = container.querySelector(".wfd--carousel-story-container"),
					forwardBtn = container.querySelector(".btn__forward"),
					backBtn = container.querySelector(".btn__back"),
					cardIndex = 0,
					// cardSize = container.querySelector(".wfd--carousel-buttons").offsetWidth + 24,
					cardSize2 = container.querySelector(".wfd--card").offsetWidth + 70,
					tablet = window.matchMedia('(min-width:768px) and (max-width:1024px').matches,
					activeCards = container.querySelectorAll(".wfd--card:not(.wfd--card__inactive)"),
					dotContainer = container.parentElement.querySelector(".wfd--carousel-nav"),
					dots = dotContainer.querySelectorAll(".wfd--carousel-tab"),
					width = (window.innerWidth - cardSize2) / 2,
					activeDot;

			// on initialization, set carousel position
			cardContainer.style.transform = `translateX(${width}px)`;
			backBtn.classList.add("btn__hidden");

			// let's make sure the heights match on initalization
			activeCards.forEach(active => {
				setHeight(active);
			})

			// check height and set if need be
			function setHeight(elem){
				let parentHeight = window.getComputedStyle(container).getPropertyValue('height').split("px")[0],
						cardHeight = window.getComputedStyle(elem).getPropertyValue('height').split("px")[0];

				if (cardHeight > parentHeight) {
					container.style.height = Number(cardHeight) + 20 + "px";
				} else {
					container.style = null;
				}
			}

			// update the card class and the tabs that show position
			function changeActiveCard(){
				activeDot = dotContainer.querySelector(".carousel__active-card");

				activeDot.classList.remove("carousel__active-card");
				dots[cardIndex].classList.add("carousel__active-card");

				function setNavigation(){
					// set navigation of dots
					if (cardIndex > 0 && cardIndex < (cards.length - 1)) {
						backBtn.classList.contains("btn__hidden") ? backBtn.classList.remove("btn__hidden") : "";
						forwardBtn.classList.contains("btn__hidden") ? forwardBtn.classList.remove("btn__hidden") : "";
					} else if (cardIndex == (cards.length - 1)) {
						!forwardBtn.classList.contains("btn__hidden") ? forwardBtn.classList.add("btn__hidden") : "";
						backBtn.classList.contains("btn__hidden") ? backBtn.classList.remove("btn__hidden") : "";
					} else if (cardIndex == 0) {
						if (forwardBtn.classList.contains("btn__hidden")) { forwardBtn.classList.remove("btn__hidden") };
						if (!backBtn.classList.contains("btn__hidden")) { backBtn.classList.add("btn__hidden") };
					}
				}
				
				setNavigation();

				// set card in view
				cards.forEach((card, i) => {
					if (i !== cardIndex) {
						card.classList.add("wfd--card__inactive");
					} else if (i == cardIndex) {
						setHeight(card);
						card.classList.contains("wfd--card__inactive") ? card.classList.remove("wfd--card__inactive") : "";
					}
				});

				function setAnalytics(){
					let elem = container.parentElement.parentElement;
							parent = elem.id.split("subsection__")[1];

					switch (parent) {
						case 'diversifying-public-work':
							analytics("carousel_label", "Diversifying our public-facing work");
							break;
						case 'inclusive-workplace':
							analytics("carousel_label", "Supporting an Inclusive Workplace");
							break;
						case 'building-pathways':
							analytics("carousel_label", "Building pathways for the next generation");
							break;
						default:
							analytics("carousel_label", "Carousel");
					}
				}

				setAnalytics();
			}

			// use dots above each carousel as navigation
			function moveViaDots(){
				dots.forEach((dot, index) => {
					dot.addEventListener("click", e => {
						let diff;
						e.target.blur();

						// first, we check if we are moving forwards or backwards in the navigation
						if ((index - cardIndex) > 0) {
							// store the difference between our desired position and our current position
							diff = index - cardIndex;

							// if we need to move more than once, loop the function to move
							// otherwise just call the directional function
							if (diff > 1) {
								for (let i = 0; i < diff; i++) {
									moveCarouselForward();
								}
							} else {
								moveCarouselForward();
							}
						} else if ((index - cardIndex) < 0) {
							diff = index - cardIndex;

							if (diff < -1) {
								for (let i = 0; i < Math.abs(diff); i++) {
									moveCarouselBack();
								}
							} else {
								moveCarouselBack();
							}
						}
						
					})
				})
			}

			// move through the carousel
			function moveCarouselForward(){
				let currentPosition = cardContainer.style.transform.split(/[^0-9-.]/gi).filter(entry => { return entry !== ''}),
						newPosition = Number(currentPosition) - cardSize2;
						
				if (cardIndex < cards.length) {
					cardIndex++;
					cardContainer.style.transform = `translateX(-${Math.abs(newPosition)}px)`;

					changeActiveCard();
				}

			}

			function moveCarouselBack(){
				let currentPosition = cardContainer.style.transform.split(/[^0-9-.]/gi).filter(entry => { return entry !== ''}),
						newPosition = Number(currentPosition) + cardSize2;

				if (cardIndex > 0) {
					cardIndex--;
					cardContainer.style.transform = `translateX(${newPosition}px)`;

					changeActiveCard();
				}
			}

			// we need to capture and enable swipe events on mobile
			function swipeEnable(){
				container.addEventListener("touchstart", startTouch, { passive: true });
				container.addEventListener("touchmove", moveTouch, { passive: true });

				var initialX = null,
						initialY = null;

				function startTouch(e){
					initialX = e.touches[0].clientX;
					initialY = e.touches[0].clientY;
				}

				function moveTouch(e){
					if (initialX === null) {
						return;
					}

					if (initialY === null) {
						return;
					}

					var currentX = e.touches[0].clientX;
					var currentY = e.touches[0].clientY;

					var diffX = initialX - currentX;
					var diffY = initialY - currentY;

					if(Math.abs(diffX) > Math.abs(diffY)) {
						// we are sliding horizontally
						if (diffX > 0) {
							console.log("swiping forward");
							moveCarouselForward();
						} else {
							console.log("swiping back");
							moveCarouselBack();
						}
					}

					initialX = null;
					initialY = null;

					e.preventDefault();
				}
			}

			forwardBtn.addEventListener("click", e => {
				e.target.blur();
				moveCarouselForward()
			});

			backBtn.addEventListener("click", e => {
				e.target.blur();
				moveCarouselBack();
			});

			swipeEnable();
			moveViaDots();
		});

		window.addEventListener("resize", debounce(function(e){
			let carousels = document.querySelectorAll(".wfd--carousel-container");

			carousels.forEach(carousel => {
				let container = carousel.querySelector(".wfd--carousel-story-container"),
				tabs = carousel.querySelectorAll(".wfd--carousel-tab"),
				button = carousel.querySelector(".wfd--carousel-buttons").getBoundingClientRect(),
				diff, newSize, index;

				for(let i=0;i < tabs.length;i++){
					if (tabs[i].classList.contains("carousel__active-card")) {
						index = i;
						break;
					}
				}

				if (index == 0) {
					container.style.transform = `translateX(${button.left - 12}px)`;
				} else {
					let amt = (button.width * index) - (button.left - 32);

					container.style.transform = `translateX(-${amt}px)`;
				}

			})

			 size = window.innerWidth;
		}));
	}

	console.log("Hello world!");