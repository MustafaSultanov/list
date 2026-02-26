import GradualBlur from "@/components/GradualBlur";

export default function AboutPage() {
	return (
		<section style={{ position: "relative", height: 500, overflow: "hidden" }}>
			<div style={{ height: "100%", overflowY: "auto", padding: "6rem 2rem" }}>
				<h1>
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus
					sunt nihil obcaecati quidem facilis nisi! Voluptatum reprehenderit
					architecto qui amet! Beatae blanditiis molestiae dolorum explicabo
					quae quam a ratione reprehenderit nemo. Nobis ipsa dolores dolorum
					delectus tenetur molestiae. Adipisci, officiis.
				</h1>
        	<h1>
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus
					sunt nihil obcaecati quidem facilis nisi! Voluptatum reprehenderit
					architecto qui amet! Beatae blanditiis molestiae dolorum explicabo
					quae quam a ratione reprehenderit nemo. Nobis ipsa dolores dolorum
					delectus tenetur molestiae. Adipisci, officiis.
				</h1>	<h1>
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus
					sunt nihil obcaecati quidem facilis nisi! Voluptatum reprehenderit
					architecto qui amet! Beatae blanditiis molestiae dolorum explicabo
					quae quam a ratione reprehenderit nemo. Nobis ipsa dolores dolorum
					delectus tenetur molestiae. Adipisci, officiis.
				</h1>
				<img
					src="https://as2.ftcdn.net/jpg/03/81/84/67/1000_F_381846798_YYHmPWMBXcoLF9TVBHM4uWaak7xE1B9Q.jpg"
					alt="foto"
					className="flex justify-center items-center w-[500px] h-[300px]"
				/>
				<h1>
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus
					sunt nihil obcaecati quidem facilis nisi! Voluptatum reprehenderit
					architecto qui amet! Beatae blanditiis molestiae dolorum explicabo
					quae quam a ratione reprehenderit nemo. Nobis ipsa dolores dolorum
					delectus tenetur molestiae. Adipisci, officiis.
				</h1>{" "}
				<h1>
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus
					sunt nihil obcaecati quidem facilis nisi! Voluptatum reprehenderit
					architecto qui amet! Beatae blanditiis molestiae dolorum explicabo
					quae quam a ratione reprehenderit nemo. Nobis ipsa dolores dolorum
					delectus tenetur molestiae. Adipisci, officiis.
				</h1>
			</div>

			<GradualBlur
				target="parent"
				position="bottom"
				height="6rem"
				strength={2}
				divCount={5}
				curve="bezier"
				exponential={true}
				opacity={1}
			/>
		</section>
	);
}
